import Flutterwave from 'flutterwave-node-v3';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { BadRequestError } from '../../utils/errors';
import { Transaction, User } from '../../utils/types';

process.env.NODE_ENV === 'testing' && admin.initializeApp();

const { FLW_PUBLIC_KEY, FLW_SECRET_KEY, NODE_ENV } = process.env;
const flw = new Flutterwave(
  FLW_PUBLIC_KEY as string,
  FLW_SECRET_KEY as string,
  NODE_ENV === 'production'
);

const db = admin.firestore();
/**
 *
 * @param tx_ref  transaction reference
 * @param tx_id transaction id
 */
export function handleTransactionFulfillment(
  tx_ref: string,
  tx_id: string
): Promise<'success' | 'fail'> {
  return new Promise(async (resolve, reject) => {
    try {
      // Check that transaction refernce exists
      const txDoc = await db.doc('transactions/' + tx_ref).get();
      if (!txDoc.exists) throw new BadRequestError('TRANSACTION_NOT_FOUND');

      const { user_uid, fulfilled } = txDoc.data() as Transaction;

      // Check if the transaction was already fulfilled
      if (fulfilled) {
        resolve('success');
        return;
      }

      const { status, data } = await flw.Transaction.verify({
        id: tx_id,
      });

      if (data.amount && status === 'success') {
        const userDoc = await db.doc('users/' + user_uid).get();
        const u = userDoc.data() as User;
        const current_amount =
          parseFloat(u.current_amount as any) + parseFloat(data.amount as any);
        const notifications = [
          {
            at: new Date().toISOString(),
            message: `You have topped up UGX ${data.amount} on your account`,
          },
          ...u.notifications,
        ];
        const transactions: User['transactions'] = [
          {
            action: 'balance-top-up',
            amount: data.amount,
            at: new Date().toISOString(),
          },
          ...u.transactions,
        ];
        // Update records with new data
        await db.doc('users/' + user_uid).update({
          current_amount,
          notifications,
          transactions,
        });
        await db.doc('transactions/' + tx_ref).update({
          fulfilled: true,
        });
        process.env.NODE_ENV !== 'testing' &&
          functions.logger.log(`user balanace top up`, {
            user: {
              uid: user_uid,
              email: u.email,
            },
            tx_ref,
            status: 'successful',
          });
        resolve('success');
        return;
      } else {
        await db.doc('transactions/' + tx_ref).delete();
        process.env.NODE_ENV !== 'testing' &&
          functions.logger.error(`failed user top up`, {
            user: {
              uid: user_uid,
            },
            status: 'fail',
          });
        resolve('fail');
      }
    } catch (e) {
      reject(e);
    }
  });
}
