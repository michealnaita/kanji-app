import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import {
  FlutterwaveResponse,
  PaymentRequestData,
  Transaction,
} from '../../utils/types';
import { v4 } from 'uuid';
process.env.NODE_ENV === 'testing' && admin.initializeApp();
const db = admin.firestore();

const generateRechargeLink = functions
  .runWith({ secrets: ['APP_URL', 'PAYMENT_WEBHOOK'] })
  .https.onCall(
    async ({ phone, amount, email, name }: PaymentRequestData, context) => {
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
      const tx_ref = NODE_ENV === 'testing' ? 'tx_ref' : v4();
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
          title: 'Kanji App',
          logo: APP_URL + '/images/logo.svg',
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
            'cancelled',
            'couldnt generate recharge link'
          );
        const txData: Transaction = {
          user_uid: context.auth.uid,
          amount: parseInt(amount as any),
          fulfilled: false,
        };
        await db.doc('transactions/' + tx_ref).create(txData);
        return data;
      } catch (e: any) {
        if (e! instanceof functions.https.HttpsError)
          throw new functions.https.HttpsError('unknown', e.message);
        throw e;
      }
    }
  );
export default generateRechargeLink;
