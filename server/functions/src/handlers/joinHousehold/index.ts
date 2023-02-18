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
const joinHousehold = functions.https.onCall(
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

    const { price, service, name, members } = householdDoc.data() as Household;
    const { current_amount, households, firstname, phone, reserved } =
      userDoc.data() as User;

    // Check if user is already in a household with the same service
    const hasService = households.length
      ? !!households.filter((h) => h.service === service).length
      : false;
    if (hasService) {
      return {
        status: 'fail',
        error: { code: 'ALREADY_HAS_SERVICE' },
      };
    }

    // Check if User is Already Member of household
    const isMember = !!members.filter((m) => m.id === uid).length;
    if (isMember) {
      return {
        status: 'fail',
        error: { code: 'ALREADY_MEMBER' },
      };
    }
    // Check if user has enough money to pay for the service
    if (price > current_amount) {
      return {
        status: 'fail',
        error: { code: 'INSUFFICIENT_BALANCE' },
      };
    }
    if (reserved && price > current_amount - parseFloat(reserved as any)) {
      return {
        status: 'fail',
        error: { code: 'BALANCE_RESERVED' },
      };
    }

    const updatedHouseholds: HouseholdSlim[] = [
      ...households,
      {
        id: householdDoc.id,
        service,
        name,
      },
    ];
    const updatedMembers: HouseholdMember[] = [
      ...members,
      {
        id: uid,
        firstname,
        phone,
      },
    ];

    const newReserved = reserved
      ? parseFloat(reserved as any) + parseFloat(price as any)
      : parseFloat(price as any);

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
export default joinHousehold;
