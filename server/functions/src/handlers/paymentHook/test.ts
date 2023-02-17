import { Transaction, User } from './../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import paymentHook from '.';
import dotenv from 'dotenv';

dotenv.config();
const testEnv = functions(
  {
    projectId: 'kanji-app-a5036',
  },
  './service-account.json'
);
const db = admin.firestore();
async function createDoc(data: { [key: string]: any }, path: string) {
  return await admin.firestore().doc(path).create(data);
}
async function getRediractUrl(req) {
  return new Promise(async (resolve, _) => {
    const res = {
      redirect: (url: string) => resolve(url),
    };
    await paymentHook(req as any, res as any);
  });
}

const mockVerify = jest.fn();
const mockFind = jest.fn();
jest.mock('flutterwave-node-v3', () => {
  return jest.fn().mockImplementation(() => ({
    Transaction: {
      verify: mockVerify,
      find: mockFind,
    },
  }));
});

describe('Rechargeb Hook', () => {
  jest.setTimeout(30000);
  const userData = { current_amount: 1000 };
  const txData: Transaction = {
    user_uid: 'user_uid',
    amount: 1000,
    fulfilled: false,
  };
  beforeAll(async () => {
    await createDoc(userData, 'users/user_uid');
    await createDoc({ ...txData, fulfilled: true }, 'transactions/tx_ref_2');
  });
  beforeEach(async () => {
    await createDoc(txData, 'transactions/tx_ref_1');
  });
  afterEach(async () => {
    await db.doc('transactions/tx_ref_1').delete();
  });
  afterAll(async () => {
    await db.doc('users/user_uid').delete();
    await db.doc('transactions/tx_ref_2').delete();
    testEnv.cleanup();
  });
  it('should fail with BadRequest page when invalid tx ref', async () => {
    const req = {
      query: {
        transaction_id: 'tx_id',
        tx_ref: 'wrong_tx_ref',
      },
    };
    const url = await getRediractUrl(req);
    expect(url).toMatch(/400\?code=invalid-tx_ref/);
  });
  it('should return transacton failed if invalid transaction id', async () => {
    mockVerify.mockResolvedValue({ status: 'error' });
    const req = {
      query: {
        tx_ref: 'tx_ref_1',
        transaction_id: 'wrong_tx_id',
      },
    };
    const url = await getRediractUrl(req);
    expect(url).toMatch(/recharge\?status=fail/);
  });
  it('should return transacton return BadRequest if transaction is already fulfilled', async () => {
    mockVerify.mockResolvedValue({ status: 'error' });
    const req = {
      query: {
        tx_ref: 'tx_ref_2',
        transaction_id: 'tx_id',
      },
    };
    const url = await getRediractUrl(req);
    expect(url).toMatch(/400\?code=transaction-already-fulfilled/);
  });
  it('should update users current amount and trasnaction fulfilment if transactions is successful', async () => {
    mockVerify.mockResolvedValue({
      status: '',
      data: { status: 'successful' },
    });
    mockFind.mockResolvedValue({ amount: 1000 });

    const req = {
      query: {
        tx_ref: 'tx_ref_1',
        transaction_id: 'tx_id',
      },
    };
    await paymentHook(req as any, { redirect: () => {} } as any);
    const userDoc = await db.doc('users/user_uid').get();
    const txDoc = await db.doc('transactions/tx_ref_1').get();
    expect((userDoc.data() as User).current_amount).toEqual(2000);
    expect((txDoc.data() as Transaction).fulfilled).toBe(true);
  });
  it('should redirect user to success page if transaction is successful', async () => {
    mockVerify.mockResolvedValue({
      status: '',
      data: { status: 'successful' },
    });
    mockFind.mockResolvedValue({ amount: 1000 });
    const req = {
      query: {
        tx_ref: 'tx_ref_1',
        transaction_id: 'tx_id',
      },
    };
    const url = await getRediractUrl(req);
    expect(url).toMatch(/recharge\?status=success/);
  });
  it('should redirect user to fail page if transaction failed', async () => {
    mockVerify.mockResolvedValue({ status: '', data: { status: 'failed' } });
    const req = {
      query: {
        tx_ref: 'tx_ref_1',
        transaction_id: 'tx_id',
      },
    };
    const url = await getRediractUrl(req);
    expect(url).toMatch(/recharge\?status=fail/);
  });
});
