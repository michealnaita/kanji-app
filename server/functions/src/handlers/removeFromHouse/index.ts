import {
  User,
  FunctionResponse,
  Admin,
  House,
  HouseMember,
  UserNotification,
} from '../../utils/types';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db: admin.firestore.Firestore = admin.firestore();

export type RequestData = {
  house: string;
  user: string;
};
const addToHouse = functions.https.onCall(
  async ({ house, user }: RequestData, context): Promise<FunctionResponse> => {
    try {
      if (!(context.auth && context.auth.uid))
        throw new functions.https.HttpsError(
          'unauthenticated',
          'IS_UNAUTHENTICATED'
        );

      if (!house)
        throw new functions.https.HttpsError(
          'failed-precondition',
          'MISSING_HOUSE_ID'
        );
      if (!user)
        throw new functions.https.HttpsError(
          'failed-precondition',
          'MISSING_USER_UID'
        );

      const uid = context.auth.uid;
      const adminRef = db.doc('users/' + uid);
      const userRef = db.doc('users/' + user);
      const houseRef = db.doc('houses/' + house);
      // Order of check affects the tests

      const adminDoc = await adminRef.get();
      if (!adminDoc.exists)
        throw new functions.https.HttpsError('not-found', 'ADMIN_NOT_FOUND');
      const { roles } = adminDoc.data() as User;
      const isAdmin = !!roles.filter((role) => role === 'admin').length;
      if (!isAdmin)
        throw new functions.https.HttpsError(
          'permission-denied',
          'NOT_AUTHORIZED'
        );
      const userDoc = await userRef.get();
      if (!userDoc.exists)
        throw new functions.https.HttpsError('not-found', 'USER_NOT_FOUND');

      const houseDoc = await houseRef.get();
      if (!houseDoc.exists)
        throw new functions.https.HttpsError('not-found', 'HOUSE_NOT_FOUND');

      const u = userDoc.data() as User;
      const h = houseDoc.data() as House;
      const a = adminDoc.data() as Admin;
      const isMember = !!h.members.filter(({ id }) => id === user).length;
      if (!isMember)
        return {
          status: 'fail',
          error: {
            code: 'NOT_A_MEMBER',
            message: 'user is not member of house',
          },
        };
      const members: HouseMember[] = h.members.filter(({ id }) => id !== user);
      const houses = a.houses.map((h) => {
        if (h.id === house)
          return {
            ...h,
            capacity: h.capacity - 1,
          };
        return h;
      });
      const services = u.services.filter((s) => s.house !== house);
      const notification: UserNotification = {
        message: `Your ${h.service} subscription has been terminated`,
        at: new Date().toISOString(),
      };
      const notifications: UserNotification[] = [
        notification,
        ...u.notifications,
      ];

      // UPDATE DOCUMENTS WITH NEW DATA
      await userRef.update({ services, notifications });
      await adminRef.update({ houses });
      await houseRef.update({ members });

      return {
        status: 'success',
        data: {
          houses,
        },
      };
    } catch (err: any) {
      if (err instanceof functions.https.HttpsError) throw err;
      process.env.NODE_ENV === 'testing'
        ? console.log(err)
        : functions.logger.error(err);
      throw new functions.https.HttpsError('internal', 'INTERNAL_SERVER_ERROR');
    }
  }
);
export default addToHouse;
