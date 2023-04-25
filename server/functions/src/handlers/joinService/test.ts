import functions from 'firebase-functions-test';
import admin from 'firebase-admin';
import joinService from '.';
import { FunctionResponse, User } from '../../utils/types';
const testEnv = functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);

const db = admin.firestore();
const adminSendMock = jest.fn();
const userSendMock = jest.fn();
jest.mock('../../utils/email/email', () => ({
  UserEmail: function () {
    return {
      onJoinService: () => ({
        send: userSendMock,
      }),
    };
  },
  AdminEmail: function () {
    return {
      onNewRequest: () => ({
        send: adminSendMock,
      }),
    };
  },
}));
describe('Add User To Service', () => {
  jest.setTimeout(30000);
  const user = {
    uid: 'user_1',
    path: 'users/user_1',
    data: {
      email: 'user@test.com',
      firstname: 'User',
      phone: 1234567,
      services: [],
      current_amount: 0,
      notifications: [],
      transactions: [],
    },
  };
  let wrapped: any;
  beforeAll(async () => {
    wrapped = testEnv.wrap(joinService);
  });
  afterAll(() => {
    testEnv.cleanup();
  });
  describe('Add User To Service: Fail', () => {
    it('Should throw Error if client unauthenticated', async () => {
      const ctx = {};
      await expect(wrapped({}, ctx)).rejects.toThrow(/IS_UNAUTHENTICATED/);
    });
    it('Should throw Error if service id is not provided', async () => {
      const ctx = { auth: { uid: 'user_1' } };
      await expect(wrapped({}, ctx)).rejects.toThrow(/MISSING_SERVICE_ID/);
    });
    it('Should throw Error if user was not found', async () => {
      const ctx = {
        auth: {
          uid: 'user_2',
        },
      };
      await expect(wrapped({ service_id: 'spotify' }, ctx)).rejects.toThrow(
        /USER_NOT_FOUND/
      );
    });
    it('Should fail when already has service', async () => {
      const u = {
        ...user,
        data: {
          ...user.data,
          services: [{ id: 'netflix' }],
        },
      };
      await db.doc(u.path).create(u.data);
      const ctx = {
        auth: { uid: u.uid },
      };
      const data = { service_id: 'netflix' };
      const res = await wrapped(data, ctx);
      await db.doc(u.path).delete();
      expect((res as FunctionResponse).status).toEqual('fail');
      expect((res as FunctionResponse).error?.code).toEqual(
        'ALREADY_HAS_SERVICE'
      );
    });
    it('Should fail when user has insufficient balance', async () => {
      await db.doc(user.path).create(user.data);
      const ctx = {
        auth: { uid: user.uid },
      };
      const data = { service_id: 'netflix' };
      const res = await wrapped(data, ctx);
      await db.doc(user.path).delete();
      expect((res as FunctionResponse).status).toEqual('fail');
      expect((res as FunctionResponse).error?.code).toEqual(
        'INSUFFICIENT_BALANCE'
      );
    });
  });
  describe('Add User To Service: Success', () => {
    let res: FunctionResponse;
    let userDoc: User;
    const u = {
      ...user,
      data: {
        ...user.data,
        current_amount: 10000,
      },
    };
    beforeAll(async () => {
      await db.doc(u.path).create(u.data);
      const ctx = {
        auth: { uid: u.uid },
      };
      const data = { service_id: 'spotify' };
      res = await wrapped(data, ctx);
      userDoc = (await db.doc(u.path).get()).data() as any;
    });
    afterAll(async () => {
      await db.doc(u.path).delete();
    });
    it('should response with succes when user is added to service', async () => {
      expect(res.status).toEqual('success');
      expect(res.data).toBeDefined();
    });
    it('should update user with new service', async () => {
      expect(userDoc.services).toHaveLength(1);
      expect(userDoc.services[0].id).toEqual('spotify');
    });
    it('should update user with new event notification', async () => {
      expect(userDoc.notifications).toHaveLength(1);
    });
    it('should update user with new transaction', async () => {
      expect(userDoc.transactions).toHaveLength(1);
      expect(userDoc.transactions[0].action).toEqual('service-payment');
    });
    it('Should alert Admin on new request', () => {
      expect(adminSendMock).toBeCalled();
    });
    it('Should send a notification email to user', () => {
      expect(userSendMock).toBeCalled();
    });
  });
});
