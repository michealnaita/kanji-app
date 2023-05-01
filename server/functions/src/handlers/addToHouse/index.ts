import { UserEmail } from './../../utils/email/email';
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
import { getRenewalDate } from '../../utils/helpers';
import moment from 'moment';

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
      const currentUserRef = db.doc('users/' + uid);
      const userRef = db.doc('users/' + user);
      const houseRef = db.doc('houses/' + house);
      const adminRef = db.doc('system/admin');
      // Order of check affects the tests

      const currentUserDoc = await currentUserRef.get();
      if (!currentUserDoc.exists)
        throw new functions.https.HttpsError('not-found', 'ADMIN_NOT_FOUND');
      const { roles } = currentUserDoc.data() as User;
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

      // CHECK THAT USER ISN'T ALREADY A MEMBER OF THAT HOUSE
      const isMember = !!h.members.filter(({ uid }) => uid === user).length;
      if (isMember)
        return {
          status: 'fail',
          error: {
            code: 'ALREADY_A_MEMBER',
            message: 'user is already a member of house',
          },
        };
      // CHECK THAT THE HOUSE ISN'T ALREADY AT MAXIMUM CAPACITY
      if (h.members.length === 5) {
        return {
          status: 'fail',
          error: {
            code: 'HOUSE_AT_MAXIMUM_CAPACITY',
            message: 'House is at max capacity',
          },
        };
      }

      const adminDoc = await adminRef.get();
      const a = adminDoc.data() as Admin;

      const now = moment();

      const member: HouseMember = {
        email: u.email,
        uid: user,
        name: u.firstname + ' ' + u.lastname,
      };
      const members: HouseMember[] = [...h.members, member];
      const pending_requests = a.pending_requests.filter(
        ({ uid }) => uid !== user
      );
      const houses = a.houses.map((h) => {
        if (h.id === house)
          return {
            ...h,
            capacity: h.capacity + 1,
          };
        return h;
      });
      const services = u.services.map((s) => {
        if (s.id == h.service)
          return {
            ...s,
            at: now.toISOString(),
            renewal: moment(now).add(1, 'month').toISOString(),
            status: 'active',
            house: house,
          };
        return s;
      });
      const active_services: Admin['active_services'] = [
        {
          email: u.email,
          uid: user,
          service: h.service,
          at: now.toISOString(),
          renewal: moment(now).add(1, 'month').toISOString(),
        },
        ...a.active_services,
      ];
      const notification: UserNotification = {
        message: `Your ${h.service} subscription has been proccessed check your email on how to procced`,
        at: now.toISOString(),
      };
      const notifications: UserNotification[] = [
        notification,
        ...u.notifications,
      ];
      // UPDATE DOCUMENTS WITH NEW DATA
      await userRef.update({ services, notifications });
      await adminRef.update({ pending_requests, houses, active_services });
      await houseRef.update({ members });

      // NOTIFY USER
      new UserEmail({
        email: u.email,
        name: u.firstname,
      })
        .onActiveService({
          start: now.toISOString(),
          end: moment(now).add(1, 'month').toISOString(),
          service: h.service,
          link: h.link,
          address: h.address,
        })
        .send();

      return {
        status: 'success',
        data: {
          pending_requests,
          houses,
          active_services,
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
