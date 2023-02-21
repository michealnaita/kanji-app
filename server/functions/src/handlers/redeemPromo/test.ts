import { Promo, User } from './../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import redeemPromo from '.';
import { FunctionResponse } from '../../utils/types';

const testEnv = functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);

const db = admin.firestore();

let wrapped: any;
let user: { uid: string; data: any; path: string };
let promo: { id: string; data: any; path: string };

jest.mock('../../utils/alertAdmin');
describe('Redeem Promo', () => {
  jest.setTimeout(30000);
  beforeAll(() => {
    wrapped = testEnv.wrap(redeemPromo);
  });
  afterAll(() => {
    testEnv.cleanup();
  });
  describe('Failed Promo Redeem', () => {
    afterEach(async () => {
      await db.recursiveDelete(db.collection('users'));
      await db.recursiveDelete(db.collection('promos'));
    });
    it('should check that client submited users uid', async () => {
      await expect(wrapped({}, { auth: { auth: {} } })).rejects.toThrow(
        /missing users uid/
      );
    });
    it('should check that client submited promo code', async () => {
      await expect(wrapped({}, { auth: { uid: 'user_id' } })).rejects.toThrow(
        /missing promo code/
      );
    });
    it('should fail when client uses invalid promo code', async () => {
      expect(
        (await wrapped({ code: 'promo-code' }, { auth: { uid: 'user_id' } }))
          .error.code
      ).toMatch(/INVALID_PROMO_CODE/);
    });
    it('should fail when client uses unknown user uid', async () => {
      const promo = {
        id: 'promo_2',
        path: 'promos/promo_2',
        data: {},
      };
      await db.doc(promo.path).create(promo.data);
      await expect(
        wrapped({ code: promo.id }, { auth: { uid: 'user_1' } })
      ).rejects.toThrow(/user not found/);
    });
    it('should fail when client submits a promo code they already used', async () => {
      user = {
        uid: 'user_1',
        data: {},
        path: '',
      };
      promo = {
        id: 'promo_2',
        path: 'promos/promo_2',
        data: { users: [user.uid] },
      };
      await db.doc(promo.path).create(promo.data);
      expect(
        (await wrapped({ code: promo.id }, { auth: { uid: user.uid } })).error
          .code
      ).toMatch(/USED_PROMO_CODE/);
    });
    it('should fail when client uses an expired promo code', async () => {
      promo = {
        id: 'promo_2',
        path: 'promos/promo_2',
        data: {
          expired: true,
        },
      };
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: {
          promos: ['promo_2'],
        },
      };
      await db.doc(promo.path).create(promo.data);
      await db.doc(user.path).create(user.data);
      expect(
        (await wrapped({ code: 'promo_2' }, { auth: { uid: 'user_1' } })).error
          .code
      ).toMatch(/EXPIRED_PROMO_CODE/);
    });
    it('should fail when client uses promo code for service they already have', async () => {
      promo = {
        id: 'promo_2',
        path: 'promos/promo_2',
        data: {
          household: {
            service: 'netflix',
          },
        },
      };
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: {
          households: [{ service: promo.data.household.service }],
        },
      };
      await db.doc(promo.path).create(promo.data);
      await db.doc(user.path).create(user.data);
      expect(
        (await wrapped({ code: promo.id }, { auth: { uid: user.uid } })).error
          .code
      ).toMatch(/ALREADY_HAS_SERVICE/);
    });
  });
  describe('Successfull Promo Redeem', () => {
    let res: FunctionResponse;

    beforeAll(async () => {
      promo = {
        id: 'promo_2',
        path: 'promos/promo_2',
        data: {
          slots: 2,
          users: [],
          household: {
            id: 'household_1',
          },
        },
      };
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: {
          households: [],
        },
      };
      await db.doc(promo.path).create(promo.data);
      await db.doc(user.path).create(user.data);
      res = await wrapped({ code: promo.id }, { auth: { uid: user.uid } });
    });
    afterAll(async () => {
      await db.recursiveDelete(db.collection('users'));
      await db.recursiveDelete(db.collection('promos'));
    });
    it('should upate user with new households', async () => {
      const u = await db.doc(user.path).get();
      const { households } = u.data() as User;
      expect(households).toContainEqual(promo.data.household);
    });
    it('should upate promo with new users and reduce slot count', async () => {
      const p = await db.doc(promo.path).get();
      const { slots, users } = p.data() as Promo;
      expect(users).toContain<string>(user.uid);
      expect(slots).toEqual(1);
    });
    it('should return success and updated user households', () => {
      expect(res.status).toEqual('success');
      expect(res.data?.households).toEqual([promo.data.household]);
    });

    it('should expire promo when all slots are full', async () => {
      const user_2 = { ...user, uid: 'user_2' };
      db.doc('users/' + user_2.uid).create(user_2.data);
      await wrapped({ code: promo.id }, { auth: { uid: user_2.uid } });
      const p = await db.doc(promo.path).get();
      const { expired } = p.data() as Promo;
      expect(expired).toStrictEqual<boolean>(true);
    });
  });
});
