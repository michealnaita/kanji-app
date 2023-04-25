import { User, FunctionResponse, House, Admin } from '../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import addToHouse from '.';

const testEnv = functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);
let wrapped: any;
const db = admin.firestore();
const sendMock = jest.fn();
jest.mock('../../utils/email/email', () => ({
  UserEmail: function () {
    return {
      onActiveService: () => ({
        send: sendMock,
      }),
    };
  },
}));
describe('Add User to House', () => {
  jest.setTimeout(30000);
  beforeAll(() => {
    wrapped = testEnv.wrap(addToHouse);
  });
  afterAll(() => {
    testEnv.cleanup();
  });

  describe('Fail', () => {
    afterEach(async () => {
      await db.recursiveDelete(db.collection('users'));
      await db.recursiveDelete(db.collection('houses'));
    });
    it('Should throw when user is unauthenticated', async () => {
      const ctx = {};
      const data = {};
      await expect(wrapped(data, ctx)).rejects.toThrow(/IS_UNAUTHENTICATED/);
    });
    it('Should throw when missing enough data to proccess request', async () => {
      const ctx = { auth: { uid: 'admin' } };
      await expect(wrapped({ user: 'user' }, ctx)).rejects.toThrow(
        /MISSING_HOUSE_ID/
      );
      await expect(wrapped({ house: 'house' }, ctx)).rejects.toThrow(
        /MISSING_USER_UID/
      );
    });
    it('Should throw when passed non-existing user uid, house id or admin uid', async () => {
      await createDoc({}, 'users/user1');
      await createDoc({}, 'houses/house1');
      await createDoc({ roles: ['admin'] }, 'users/admin1');

      const ctx = { auth: { uid: 'admin1' } };
      await expect(
        wrapped({ house: 'house1', user: 'user1' }, { auth: { uid: 'admin2' } })
      ).rejects.toThrow(/ADMIN_NOT_FOUND/);
      await expect(
        wrapped({ house: 'house1', user: 'user2' }, ctx)
      ).rejects.toThrow(/USER_NOT_FOUND/);
      await expect(
        wrapped({ house: 'house2', user: 'user1' }, ctx)
      ).rejects.toThrow(/HOUSE_NOT_FOUND/);
    });
    it('Should throw an error is the user is not an admin', async () => {
      await createDoc({ roles: ['user'] }, 'users/admin1');
      const ctx = { auth: { uid: 'admin1' } };
      await expect(
        wrapped({ house: 'house2', user: 'user1' }, ctx)
      ).rejects.toThrow(/NOT_AUTHORIZED/);
    });
    it('Should fail when trying to add a user thats already in the house', async () => {
      await createDoc({ roles: ['user'] }, 'users/user1');
      await createDoc({ members: [{ id: 'user1' }] }, 'houses/house1');
      await createDoc({ roles: ['admin'] }, 'users/admin1');
      const res: FunctionResponse = await wrapped(
        { house: 'house1', user: 'user1' },
        { auth: { uid: 'admin1' } }
      );
      expect(res.status).toEqual('fail');
      expect(res.error!.code).toMatch(/ALREADY_A_MEMBER/);
    });
  });

  describe('Success', () => {
    let res: FunctionResponse;
    let userDoc: User;
    let adminDoc: Admin;
    let houseDoc: House;
    beforeAll(async () => {
      const user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: {
          firstname: 'Jane',
          email: 'jane@example.com',
          services: [{ id: 'spotify' }],
          notifications: [],
          roles: ['user'],
        },
      };
      const house = {
        id: 'house1',
        path: 'houses/house1',
        data: {
          service: 'spotify',
          link: 'https://service.com/join',
          name: 'my house',
          members: [],
        },
      };
      const admin = {
        uid: 'admin1',
        path: 'users/admin1',
        data: {
          pending_requests: [{ uid: user.uid }],
          houses: [{ id: house.id, capacity: 0 }],
          roles: ['admin'],
        },
      };
      await createDoc(user.data, user.path);
      await createDoc(house.data, house.path);
      await createDoc(admin.data, admin.path);
      res = await wrapped(
        { house: house.id, user: user.uid },
        { auth: { uid: admin.uid } }
      );
      userDoc = (await db.doc(user.path).get()).data() as any;
      adminDoc = (await db.doc(admin.path).get()).data() as any;
      houseDoc = (await db.doc(house.path).get()).data() as any;
    });
    afterAll(async () => {
      await db.recursiveDelete(db.collection('users'));
      await db.recursiveDelete(db.collection('houses'));
    });
    it('should remove request from admin pending requests', () => {
      expect(adminDoc.pending_requests).toHaveLength(0);
    });
    it('should update admin houses with new capacity', () => {
      expect(adminDoc.houses[0].capacity).toEqual(1);
    });
    it('should update house with new member', () => {
      expect(houseDoc.members).toHaveLength(1);
    });
    it('should update user service with status active', () => {
      expect(userDoc.services[0].status).toEqual('active');
    });
    it('should update user notifications with new notification', () => {
      expect(userDoc.notifications).toHaveLength(1);
    });
    it('should notify user through email', () => {
      expect(sendMock).toBeCalled();
    });
    it('should respond with success and new appliactions state when user has been added to house ', () => {
      expect(res.status).toEqual('success');
      expect(res.data!.pending_requests).toHaveLength(0);
      expect(res.data!.houses[0].capacity).toEqual(1);
    });
  });
});

async function createDoc(data: { [key: string]: any }, path: string) {
  return await db.doc(path).create(data);
}
