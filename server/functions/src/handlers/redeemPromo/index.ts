import { User, Promo } from './../../utils/types';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FunctionResponse } from '../../utils/types';

process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db = admin.firestore();

const redeemPromo = functions.https.onCall(
  async ({ code }: { code: string }, ctx): Promise<FunctionResponse> => {
    let uid: string;
    if (!(ctx.auth && ctx.auth.uid))
      throw new functions.https.HttpsError(
        'failed-precondition',
        'missing users uid'
      );
    uid = ctx.auth.uid;
    if (!code)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'missing promo code'
      );

    // NOTE: Order matters for tests
    const promoDoc = await db.doc('promos/' + code).get();
    if (!promoDoc.exists)
      return {
        status: 'fail',
        error: {
          code: 'INVALID_PROMO_CODE',
          message: 'you are attemping to use an invalid promo code',
        },
      };
    const { expired, household, slots, users } = promoDoc.data() as Promo;
    if (expired)
      return {
        status: 'fail',
        error: {
          code: 'EXPIRED_PROMO_CODE',
          message: 'This promo code already expired',
        },
      };
    const isUsed =
      users && users.length && !!users.filter((u) => u == uid).length;
    if (isUsed)
      return {
        status: 'fail',
        error: {
          code: 'USED_PROMO_CODE',
          message: 'you have already used this promo code',
        },
      };
    const userDoc = await db.doc('users/' + uid).get();
    if (!userDoc.exists)
      throw new functions.https.HttpsError('not-found', 'user not found');

    const { households } = userDoc.data() as User;

    const hasService =
      households.length &&
      !!households.filter((h) => h.service == household.service);
    if (hasService)
      return {
        status: 'fail',
        error: {
          code: 'ALREADY_HAS_SERVICE',
          message: `you cant use this promo code since you already have a ${household.service} service`,
        },
      };
    const updatedHouseholds = [...households, household];
    const updatedSlots = parseInt(slots as any) - 1;
    const isExpired = updatedSlots === 0;
    const updatedUsers = [...users, uid];

    await db.doc('users/' + uid).update({ households: updatedHouseholds });
    await db
      .doc('promos/' + code)
      .update({ slots: updatedSlots, expired: isExpired, users: updatedUsers });
    return {
      status: 'success',
      data: {
        message: `You have successfully redeemed your promo, you now enjoy ${household.service} in your new promo household`,
        households: updatedHouseholds,
      },
    };
  }
);

export default redeemPromo;
