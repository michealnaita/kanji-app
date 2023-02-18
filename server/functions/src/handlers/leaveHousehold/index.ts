import {
  Household,
  User,
  HouseholdSlim,
  HouseholdMember,
  FunctionResponse,
} from '../../utils/types';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db: admin.firestore.Firestore = admin.firestore();

export type RequestData = {
  household: string;
};
const leaveHousehold = functions.https.onCall(
  async ({ household }: RequestData, context): Promise<FunctionResponse> => {
    if (!household)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'missing household id'
      );
    if (!(context.auth && context.auth.uid))
      throw new functions.https.HttpsError(
        'failed-precondition',
        'missing user uid'
      );
    const uid = context.auth.uid;
    const userDoc = await db.doc('users/' + uid).get();

    // order of check affects the tests
    if (!userDoc.exists)
      throw new functions.https.HttpsError('not-found', 'user not found');
    const householdDoc = await db.doc('households/' + household).get();
    if (!householdDoc.exists)
      throw new functions.https.HttpsError('not-found', 'household not found');

    const { price, members, status } = householdDoc.data() as Household;
    const { households, reserved } = userDoc.data() as User;

    // Check if User is Member of household
    const isMember = !!members.filter((m) => m.id === uid).length;
    if (!isMember) {
      return {
        status: 'fail',
        error: { code: 'NOT_MEMBER' },
      };
    }
    // Check if user has enough money to pay for the service
    if (status === 'active') {
      return {
        status: 'fail',
        error: { code: 'SERVICE_ACTIVE' },
      };
    }

    const updatedHouseholds: HouseholdSlim[] = households.filter(
      (h) => h.id !== household
    );
    const updatedMembers: HouseholdMember[] = members.filter(
      (m) => m.id !== uid
    );

    const newReserved = reserved
      ? parseFloat(reserved as any) - parseFloat(price as any)
      : 0;

    await db
      .doc('users/' + uid)
      .update({ households: updatedHouseholds, reserved: newReserved });
    await db.doc('households/' + household).update({ members: updatedMembers });
    return {
      status: 'success',
      data: {
        households: updatedHouseholds,
      },
    };
  }
);
export default leaveHousehold;
