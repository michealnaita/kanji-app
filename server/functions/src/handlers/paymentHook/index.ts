import { BadRequestError, InternalServerError } from '../../utils/errors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Flutterwave from 'flutterwave-node-v3';
import { Transaction, User } from '../../utils/types';

admin.initializeApp();
const db = admin.firestore();

const paymentHook = functions.https.onRequest(async (req, res) => {
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

    // check that transaction is valid
    const tx = await flw.Transaction.verify({ id: transaction_id });
    if (tx.status === 'error' || !(tx.data && tx.data.status === 'successful'))
      return res.redirect(APP_URL + '/recharge?status=fail');

    if (tx.data && tx.data.status === 'successful') {
      const { amount } = await flw.Transaction.find({ ref: req.query.tx_ref });
      const { user_uid, amount: tx_amount } = txDoc.data() as Transaction;
      if (!(amount == tx_amount))
        throw new InternalServerError('different-transaction-amounts');
      const userDoc = await db.doc('users/' + user_uid).get();
      const { current_amount } = userDoc.data() as User;
      const newAmount = parseFloat(current_amount as any) + parseFloat(amount);
      await db.doc('users/' + user_uid).update({
        current_amount: newAmount,
      });
      return res.redirect(APP_URL + '/recharge?status=success');
    }
    throw new InternalServerError('transaction-neither-fail-nor-success');
  } catch (e: any) {
    const s = new URLSearchParams();
    s.set('code', e.code);
    const q = s.toString();
    if (e instanceof InternalServerError)
      return res.redirect(APP_URL + '/500?' + q);
    if (e instanceof BadRequestError)
      return res.redirect(APP_URL + '/400?' + q);
  }

  //
});

export default paymentHook;
