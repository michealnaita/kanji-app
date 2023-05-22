import { Admin, FunctionResponse } from '../../utils/types';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  User,
  UserNotification,
  UserTransaction,
  Service,
} from '../../utils/types';
import { SERVICES } from '../../settings';
import moment from 'moment';
import { AdminEmail, UserEmail } from '../../utils/email/email';

process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db = admin.firestore();

const extendSubscription = functions.https.onCall(
  async (
    { service_id, duration }: { duration: number; service_id: Service['id'] },
    ctx
  ): Promise<FunctionResponse> => {
    try {
      if (!(ctx.auth && ctx.auth.uid))
        throw new functions.https.HttpsError(
          'failed-precondition',
          'IS_UNAUTHENTICATED'
        );
      if (!service_id)
        throw new functions.https.HttpsError(
          'failed-precondition',
          'MISSING_SERVICE_ID'
        );
      if (!duration)
        throw new functions.https.HttpsError(
          'failed-precondition',
          'MISSING_DURATION'
        );
      duration = typeof duration === 'string' ? parseInt(duration) : duration;

      const uid = ctx.auth.uid;
      const userRef = db.doc('users/' + uid);
      const userDoc = await userRef.get();
      const adminRef = db.doc('system/admin');

      // order of check affects the tests
      if (!userDoc.exists)
        throw new functions.https.HttpsError('not-found', 'USER_NOT_FOUND');

      const { services, notifications, transactions, current_amount, ...rest } =
        userDoc.data() as User;
      if (services.length == 0)
        return {
          status: 'fail',
          error: {
            message: 'You are not subscribed to any services',
            code: 'NO_SERVICES',
          },
        };
      const { price: servicePrice } = SERVICES[service_id];
      const totalPrice = servicePrice * duration;
      const newBalance: number = current_amount - totalPrice;
      if (newBalance < 0)
        return {
          status: 'fail',
          error: {
            message: 'You have insufficient balance to extend your subcription',
            code: 'INSUFFICIENT_BALANCE',
          },
        };

      const a = (await adminRef.get()).data() as Admin;
      const notification: UserNotification = {
        message: `You have been charged UGX ${totalPrice} to extend your ${service_id} subscription for ${duration} months`,
        at: new Date().toISOString(),
      };
      const transaction: UserTransaction = {
        at: new Date().toISOString(),
        amount: totalPrice,
        action: 'service-payment',
      };
      const updatedService: User['services'] = services.map((service) => {
        if (service.id === service_id) {
          return {
            ...service,
            renewal: moment(service.renewal)
              .add(duration, 'month')
              .toISOString(),
          };
        }
        return service;
      });
      const updatedUserData = {
        services: updatedService,
        transactions: [...transactions, transaction],
        notifications: [notification, ...notifications],
        current_amount: newBalance,
      };
      const active_services: Admin['active_services'] = a.active_services.map(
        (service) => {
          if (service.uid === uid) {
            return {
              ...service,
              renewal: moment(service.renewal)
                .add(duration, 'month')
                .toISOString(),
            };
          }
          return service;
        }
      );
      await adminRef.update({ active_services });
      await userRef.update({ ...updatedUserData });
      await new AdminEmail()
        .onExtendSubscription({
          email: rest.email,
          username: rest.firstname + ' ' + rest.lastname,
          uid,
          service: service_id,
          duration,
        })
        .send();
      process.env.NODE_ENV !== 'testing' &&
        functions.logger.log(`user extended service subscription`, {
          user: {
            uid,
            email: rest.email,
          },
          service: service_id,
          duration,
        });
      return {
        status: 'success',
        data: updatedUserData,
      };
    } catch (error: any) {
      process.env.NODE_ENV !== 'testing' && functions.logger.log(error);
      if (error instanceof functions.https.HttpsError) throw error;
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);

export default extendSubscription;
