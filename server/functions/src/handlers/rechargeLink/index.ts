import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();

export type PaymentRequestData = {
  amount?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type FlutterwaveResponse = {
  status: string;
  message: string;
  data: {
    link: string;
  };
};
const generateRechargeLink = functions.https.onCall(
  async ({ phone, amount, email, name }: PaymentRequestData, context) => {
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

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    };
    try {
      const payload = {
        tx_ref: 'hooli-tx-1920bbtytty',
        amount,
        currency: 'UGX',
        redirect_url: 'http://localhost:5173',
        meta: {
          consumer_id: 23,
          consumer_mac: '92a3-912ba-1192a',
        },
        customer: {
          email,
          phonenumber: '256' + phone,
          name,
        },
        customizations: {
          title: 'Kanji',
          logo: 'https://www.kanji-app.com/images/logo.svg',
        },
      };

      const { data }: { data: FlutterwaveResponse } = await axios.post(
        process.env.FLUTTERWAVE_URL as string,
        payload,
        config
      );
      return data;
    } catch (e: any) {
      throw new functions.https.HttpsError('unknown', e.message);
    }
  }
);
export default generateRechargeLink;
