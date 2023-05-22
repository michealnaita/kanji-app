import functions from 'firebase-functions-test';
import admin from 'firebase-admin';
import { Admin, FunctionResponse, User } from '../../utils/types';
import extendSubscription from '.';
const testEnv = functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);

const db = admin.firestore();
const adminSendMock = jest.fn();
jest.mock('../../utils/email/email', () => ({
  AdminEmail: function () {
    return {
      onExtendSubscription: () => ({
        send: adminSendMock,
      }),
    };
  },
}));

describe('Extend Subscription', () => {
  jest.setTimeout(30000);
  let wrapped: any;
  beforeAll(() => {
    wrapped = testEnv.wrap(extendSubscription);
  });
  afterEach(() => {
    testEnv.cleanup();
  });
  describe('Fail', () => {
    it('Should throw Error if client unauthenticated', async () => {
      const ctx = {};
      await expect(wrapped({}, ctx)).rejects.toThrow(/IS_UNAUTHENTICATED/);
    });
    it('Should throw Error if service id or duration is not provided', async () => {
      const ctx = { auth: { uid: 'user_1' } };
      await expect(wrapped({ duration: 2 }, ctx)).rejects.toThrow(
        /MISSING_SERVICE_ID/
      );
      await expect(wrapped({ service_id: 'spotify' }, ctx)).rejects.toThrow(
        /MISSING_DURATION/
      );
    });
    it('Should throw Error if user was not found', async () => {
      const ctx = {
        auth: {
          uid: 'user_2',
        },
      };
      await expect(
        wrapped({ service_id: 'spotify', duration: 2 }, ctx)
      ).rejects.toThrow(/USER_NOT_FOUND/);
    });
    test('should fail when user has insufficient balance', async () => {
      const user = {
        uid: 'user1',
        path: 'users/user1',
        data: {
          current_amount: 2000,
          services: [{ id: 'spotify' }],
        },
      };
      const data = { duration: 2, service_id: 'spotify' };
      await db.doc(user.path).create(user.data);
      const res: FunctionResponse = await wrapped(data, {
        auth: { uid: user.uid },
      });
      expect(res.status).toBe('fail');
      expect(res.error?.code).toBe('INSUFFICIENT_BALANCE');
      await db.doc(user.path).delete();
    });
    test('should fail when user has no services', async () => {
      const user = {
        uid: 'user1',
        path: 'users/user1',
        data: {
          current_amount: 2000,
          services: [],
        },
      };
      const data = { duration: 2, service_id: 'spotify' };
      await db.doc(user.path).create(user.data);
      const res: FunctionResponse = await wrapped(data, {
        auth: { uid: user.uid },
      });
      expect(res.status).toBe('fail');
      expect(res.error?.code).toBe('NO_SERVICES');
      await db.doc(user.path).delete();
    });
  });
  describe('Success', () => {
    let userDoc: User;
    let adminDoc: Admin;
    let res: FunctionResponse;
    beforeAll(async () => {
      await db.recursiveDelete(db.collection('users'));
      await db.recursiveDelete(db.collection('system'));
      const user = {
        uid: 'user1',
        path: 'users/user1',
        data: {
          notifications: [],
          transactions: [],
          current_amount: 8000,
          services: [{ id: 'spotify', renewal: '2023-05-01T10:00:00Z' }],
        },
      };
      const admin = {
        path: 'system/admin',
        data: {
          active_services: [
            {
              uid: user.uid,
              service: 'spotify',
              renewal: '2023-05-01T10:00:00Z',
            },
          ],
        },
      };

      await db.doc(admin.path).create(admin.data);
      await db.doc(user.path).create(user.data);
      const data = { duration: 2, service_id: 'spotify' };
      res = await wrapped(data, { auth: { uid: user.uid } });
      adminDoc = (await db.doc(admin.path).get()).data() as any;
      userDoc = (await db.doc(user.path).get()).data() as any;
      await db.doc(user.path).delete();
      await db.doc(admin.path).delete();
    });
    test('should respond with success and new appliaction state', () => {
      expect(res.status).toBe('success');
      expect(res.data!.notifications).toHaveLength(1);
      expect(res.data!.transactions).toHaveLength(1);
      expect(res.data!.current_amount).toBe(0);
      expect(res.data!.services[0].renewal).toMatch(/2023-07-01/);
    });
    test("should extend user's renewal date", () => {
      expect(userDoc.services[0].renewal).toMatch(/2023-07-01/);
    });
    test("should deduct user's balance", () => {
      expect(userDoc.current_amount).toBe(0);
    });
    test('should add action to user notifications', () => {
      expect(userDoc.notifications).toHaveLength(1);
    });
    test('should add action to user transactions', () => {
      expect(userDoc.transactions).toHaveLength(1);
      expect(userDoc.transactions[0].action).toBe('service-payment');
    });
    test("should update user's renewal date in  admin's active services", () => {
      expect(adminDoc.active_services[0].renewal).toMatch(/2023-07-01/);
    });
    test('should alert admin of subscription extention', () => {
      expect(adminSendMock).toBeCalledTimes(1);
    });
  });
});
