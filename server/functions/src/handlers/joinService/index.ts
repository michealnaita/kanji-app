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
import { getRenewalDate } from '../../utils/helpers';
import moment from 'moment';
import { AdminEmail, UserEmail } from '../../utils/email/email';

process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db = admin.firestore();

const joinService = functions.https.onCall(
  async (
    { service_id }: { service_id: Service['id'] },
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
      const uid = ctx.auth.uid;
      const userRef = db.doc('users/' + uid);
      const userDoc = await userRef.get();
      const adminRef = db.doc('system/admin');

      // order of check affects the tests
      if (!userDoc.exists)
        throw new functions.https.HttpsError('not-found', 'USER_NOT_FOUND');

      const { services, notifications, transactions, current_amount, ...rest } =
        userDoc.data() as User;
      const hasService = !!services.filter((s) => s.id === service_id).length;
      if (hasService)
        return {
          status: 'fail',
          error: {
            message: 'You already have this service',
            code: 'ALREADY_HAS_SERVICE',
          },
        };
      const { price: servicePrice } = SERVICES[service_id];
      const newBalance: number = current_amount - servicePrice;
      if (newBalance < 0)
        return {
          status: 'fail',
          error: {
            message: 'You have insufficient balance on your account',
            code: 'INSUFFICIENT_BALANCE',
          },
        };

      const a = (await adminRef.get()).data() as Admin;
      const notification: UserNotification = {
        message: `You have been charged UGX ${servicePrice} for your ${service_id} subscription`,
        at: new Date().toISOString(),
      };
      const transaction: UserTransaction = {
        at: new Date().toISOString(),
        amount: servicePrice,
        action: 'service-payment',
      };
      const service: Service = {
        id: service_id,
        price: servicePrice,
        renewal: getRenewalDate(),
        status: 'pending',
        at: moment().format('YYYY-MM-DD'),
        membership: 'Premium',
      };
      const updatedUserData = {
        services: [...services, service],
        transactions: [...transactions, transaction],
        notifications: [notification, ...notifications],
        current_amount: newBalance,
      };
      const pending_requests: Admin['pending_requests'] = [
        ...a.pending_requests,
        {
          uid,
          email: rest.email,
          service: service_id,
          at: new Date().toISOString(),
          name: rest.firstname,
        },
      ];
      await adminRef.update({ pending_requests });
      await userRef.update({ ...updatedUserData });
      await new AdminEmail()
        .onNewRequest({
          email: rest.email,
          username: rest.firstname + ' ' + rest.lastname,
          uid,
          service: service_id,
        })
        .send();
      await new UserEmail({ email: rest.email, name: rest.firstname })
        .onJoinService(service_id)
        .send();
      process.env.NODE_ENV !== 'testing' &&
        functions.logger.log(`user joined service`, {
          user: {
            uid,
            email: rest.email,
          },
          service: service_id,
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

export default joinService;
