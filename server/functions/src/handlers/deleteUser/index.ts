import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FunctionResponse } from '../../utils/types';

process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const deleteUser = functions.https.onCall(
  async (_, ctx): Promise<FunctionResponse> => {
    if (!(ctx.auth && ctx.auth.uid))
      throw new functions.https.HttpsError(
        'unauthenticated',
        'IS_UNAUTHENTICATED'
      );
    const uid = ctx.auth.uid;
    try {
      await auth.getUser(uid);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found')
        throw new functions.https.HttpsError('not-found', 'USER_NOT_FOUND');
      throw new functions.https.HttpsError('internal', 'INTERAL_SERVER_ERROR');
    }

    // delete user from firebase auth
    await auth.deleteUser(uid);
    // delete user from firestore
    await db.doc('users/' + uid).delete();
    return {
      status: 'success',
    };
  }
);

export default deleteUser;
