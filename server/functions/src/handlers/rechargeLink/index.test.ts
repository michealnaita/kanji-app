import {
  FlutterwaveResponse,
  PaymentRequestData,
  Transaction,
} from '../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import generateRechargeLink from '.';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const testEnv = functions(
  {
    projectId: 'kanji-app-a5036',
  },
  './service-account.json'
);

const db = admin.firestore();

jest.mock('axios');
const resolvedValue: { data: FlutterwaveResponse } = {
  data: {
    status: 'success',
    message: 'Hosted Link',
    data: {
      link: 'https://example.com/test',
    },
  },
};
axios.post = jest.fn().mockResolvedValue(resolvedValue);
const wrapped = testEnv.wrap(generateRechargeLink as any);
describe('Generate Payment Link', () => {
  afterEach(async () => {
    await db.doc('transactions/tx_ref').delete();
  });
  afterAll(async () => {
    testEnv.cleanup();
  });
  it('Should generate payment link', async () => {
    const data: PaymentRequestData = {
      amount: '5000',
      name: 'Test User',
      email: 'testuser@gmail.com',
      phone: '772945846',
    };
    const auth = {
      uid: 'user_uid',
    };
    expect((await wrapped(data, { auth })).status).toMatch(/success/);
  });
  it('Should throw if client doesnt submit all user details', async () => {
    const data: PaymentRequestData = {
      amount: '5000',
      email: 'testuser@gmail.com',
      phone: '772945846',
    };
    const auth = {
      uid: 'user_uid',
    };
    expect(async () => {
      await wrapped(data, { auth });
    }).rejects.toThrow(/provide all user details/);
  });
  it('should create a transaction doc to moniter transaction', async () => {
    const data: PaymentRequestData = {
      amount: '5000',
      email: 'testuser@gmail.com',
      phone: '772945846',
      name: 'Test User',
    };
    const auth = {
      uid: 'user_uid',
    };
    await wrapped(data, { auth });
    const txDoc = await db.doc('transactions/tx_ref').get();
    const txData = txDoc.data() as Transaction;
    expect(txData).toEqual({
      user_uid: 'user_uid',
      fulfilled: false,
      amount: 5000,
    });
  });
});
