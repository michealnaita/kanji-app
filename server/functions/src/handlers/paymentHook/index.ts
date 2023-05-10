import { BadRequestError } from '../../utils/errors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express, { Express } from 'express';
import { handleTransactionFulfillment } from './utils';

process.env.NODE_ENV === 'testing' && admin.initializeApp();

const app: Express = express();

app.post('/', async (req, res) => {
  try {
    const { event, data } = req.body;
    if (event === 'charge.completed') {
      const { tx_ref, id } = data;
      await handleTransactionFulfillment(tx_ref, id);
    }
    res.status(200).send('done');
  } catch (e) {
    if (e instanceof BadRequestError) {
      process.env.NODE_ENV !== 'testing' &&
        functions.logger.log(`failed user top up`, {
          message: '',
        });
      res.status(200).send('done');
    }
    console.log(e);
    res.status(500).send('done');
  }
});

app.get('/', async (req, res) => {
  try {
    const { tx_ref = null, transaction_id = null } = req.query;
    if (!(tx_ref && transaction_id))
      throw new BadRequestError('missing-tx_ref-and-transaction_id');
    // Check if transaction ref exists
    const status = await handleTransactionFulfillment(
      tx_ref as string,
      transaction_id as string
    );
    if (status === 'fail')
      return res.redirect(process.env.APP_URL + '/recharge?status=fail');
    return res.redirect(process.env.APP_URL + '/recharge?status=success');
  } catch (e: any) {
    const s = new URLSearchParams();
    e.code && s.set('code', e.code);
    e.message && s.set('message', e.message);
    const q = s.toString();
    if (e instanceof BadRequestError)
      return res.redirect(process.env.APP_URL + '/400?' + q);
    return res.redirect(process.env.APP_URL + '/500?' + q);
  }
});

const paymentHook = functions.https.onRequest(() => {});

export default paymentHook;
