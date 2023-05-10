import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import {
  FlutterwaveResponse,
  FunctionResponse,
  PaymentRequestData,
  Transaction,
} from '../../utils/types';
import { v4 } from 'uuid';
process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db = admin.firestore();

const generateRechargeLink = functions.https.onCall(
  async (
    { phone, amount, email, name }: PaymentRequestData,
    context
  ): Promise<FunctionResponse> => {
    const { APP_URL, PAYMENT_WEBHOOK, NODE_ENV } = process.env;
    // Check for user auth
    if (context.auth) {
      if (!context.auth.uid)
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Did not receive user UID'
        );
    } else {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'provide user auth object'
      );
    }
    if (!(phone && amount && email && name))
      throw new functions.https.HttpsError(
        'failed-precondition',
        'provide all user details'
      );
    const tx_ref =
      NODE_ENV === 'testing' ? 'tx_ref' : Buffer.from(v4()).toString('base64');
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    };
    const payload = {
      tx_ref,
      amount,
      currency: 'UGX',
      redirect_url: PAYMENT_WEBHOOK,
      customer: {
        email,
        phonenumber: '256' + phone,
        name,
      },
      customizations: {
        title: process.env.APP_NAME,
        logo: APP_URL + '/logo.svg',
      },
    };
    try {
      const { data }: { data: FlutterwaveResponse } = await axios.post(
        process.env.FLUTTERWAVE_URL as string,
        payload,
        config
      );
      if (data.status !== 'success')
        throw new functions.https.HttpsError(
          'internal',
          'couldnt generate recharge link'
        );
      const txData: Transaction = {
        user_uid: context.auth.uid,
        amount: parseInt(amount as any),
        fulfilled: false,
        at: new Date().toISOString(),
      };
      await db.doc('transactions/' + tx_ref).create(txData);
      return { status: 'success', data: { link: data.data.link } };
    } catch (e: any) {
      if (!(e instanceof functions.https.HttpsError))
        throw new functions.https.HttpsError('unknown', e.message);
      throw e;
    }
  }
);
export default generateRechargeLink;
