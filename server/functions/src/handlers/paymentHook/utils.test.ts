import { Transaction, User } from './../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import { handleTransactionFulfillment } from './utils';

dotenv.config();
functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);
const db = admin.firestore();

const mockVerify = jest.fn();
jest.mock('flutterwave-node-v3', () => {
  return jest.fn().mockImplementation(() => ({
    Transaction: {
      verify: () => mockVerify(),
    },
  }));
});

describe('Transaction fulfillment', () => {
  jest.setTimeout(30000);
  describe('Failed payment', () => {
    test('should throw when provided an invalid  tx ref', async () => {
      await expect(
        handleTransactionFulfillment('tx_ref', 'tx_id')
      ).rejects.toThrow(/TRANSACTION_NOT_FOUND/);
    });
    test('should resolve fail when failed at flutterwave', async () => {
      await db.doc('transactions/tx_ref').create({});
      mockVerify.mockResolvedValue({
        status: 'fail',
        data: {},
      });
      const res = await handleTransactionFulfillment('tx_ref', 'tx_id');
      expect(res).toEqual('fail');
      await db.doc('transactions/tx_ref').delete();
    });
  });
  describe('Successfull payment', () => {
    let userDoc: User;
    let txDoc: Transaction;
    let res: string;
    const user = {
      path: 'users/user1',
      uid: 'user1',
      data: {
        current_amount: 0,
        notifications: [],
        transactions: [],
      },
    };
    const tx = {
      id: '1234567890',
      path: 'transactions/1234567890',
      data: {
        user_uid: user.uid,
        amount: 1000,
        fulfilled: false,
        at: new Date().toISOString(),
      },
    };
    const { tx_ref, tx_id } = {
      tx_ref: tx.id,
      tx_id: 'tx-1',
    };
    beforeAll(async () => {
      await db.doc(user.path).create(user.data);
      await db.doc(tx.path).create(tx.data);

      mockVerify.mockResolvedValue({
        status: 'success',
        data: { amount: tx.data.amount },
      });

      res = await handleTransactionFulfillment(tx_ref, tx_id);
      userDoc = (await db.doc(user.path).get()).data() as any;
      txDoc = (await db.doc(tx.path).get()).data() as any;
    });
    afterAll(async () => {
      await db.doc(user.path).delete();
      await db.doc(tx.path).delete();
    });
    test('should resolve success', () => {
      expect(res).toEqual('success');
    });
    test('should increase user balance', () => {
      expect(userDoc.current_amount).toEqual(tx.data.amount);
    });
    test('should add transaction to user transactions', () => {
      expect(userDoc.transactions).toHaveLength(1);
      expect(userDoc.transactions[0].action).toEqual('balance-top-up');
      expect(userDoc.transactions[0].amount).toEqual(tx.data.amount);
    });
    test('should add transaction to user notifications', () => {
      expect(userDoc.notifications).toHaveLength(1);
    });
    test('should update transaction fulfillment to true', () => {
      expect(txDoc.fulfilled).toEqual(true);
    });
    test('should return same if same transaction is retried', async () => {
      const res2 = await handleTransactionFulfillment(tx_ref, tx_id);
      expect(res2).toEqual('success');
    });
  });
});
