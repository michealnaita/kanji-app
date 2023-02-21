import { BadRequestError, InternalServerError } from '../../utils/errors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Flutterwave from 'flutterwave-node-v3';
import { Transaction, User } from '../../utils/types';

process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db = admin.firestore();

const paymentHook = functions
  .runWith({
    secrets: ['FLW_PUBLIC_KEY', 'FLW_SECRET_KEY', 'APP_URL'],
  })
  .https.onRequest(async (req, res) => {
    const { FLW_PUBLIC_KEY, FLW_SECRET_KEY, NODE_ENV, APP_URL } = process.env;
    try {
      const flw = new Flutterwave(
        FLW_PUBLIC_KEY as string,
        FLW_SECRET_KEY as string,
        NODE_ENV === 'production'
      );
      const { tx_ref = 'null', transaction_id = 'null' } = req.query;
      if (!(tx_ref && transaction_id))
        throw new BadRequestError('missing-tx_ref-and-transaction_id');

      // Check if transaction ref exists
      const txDoc = await db.doc('transactions/' + tx_ref).get();
      if (!txDoc.exists) throw new BadRequestError('invalid-tx_ref');
      const {
        user_uid,
        amount: tx_amount,
        fulfilled,
      } = txDoc.data() as Transaction;
      if (fulfilled) throw new BadRequestError('transaction-already-fulfilled');

      // check that transaction is valid
      // TODO: REVERT THIS
      // const tx = await Promise.resolve({
      //   status: 'success',
      //   data: { status: 'successful' },
      // });
      const { status, data } = await flw.Transaction.verify({
        id: transaction_id,
      });
      if (status !== 'success')
        return res.redirect(APP_URL + '/recharge?status=fail');

      if (data.amount && status === 'success') {
        // TODO: REVERT THIS
        // const { amount } = await Promise.resolve({ amount: 5000 });
        if (!(data.amount == tx_amount))
          throw new InternalServerError('different-transaction-amounts');
        const userDoc = await db.doc('users/' + user_uid).get();
        const { current_amount } = userDoc.data() as User;
        const newAmount =
          parseFloat(current_amount as any) + parseFloat(data.amount as any);
        await db.doc('users/' + user_uid).update({
          current_amount: newAmount,
        });
        await db.doc('transactions/' + tx_ref).update({
          fulfilled: true,
        });
        return res.redirect(APP_URL + '/recharge?status=success');
      }
      throw new InternalServerError('transaction-neither-fail-nor-success');
    } catch (e: any) {
      const s = new URLSearchParams();
      e.code && s.set('code', e.code);
      e.message && s.set('message', e.message);
      const q = s.toString();
      if (e instanceof BadRequestError)
        return res.redirect(APP_URL + '/400?' + q);
      return res.redirect(APP_URL + '/500?' + q);
    }

    //
  });

export default paymentHook;
