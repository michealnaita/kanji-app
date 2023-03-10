import { User, Household, FunctionResponse } from '../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import joinHousehold from '.';
import alertAdmin from '../../utils/alertAdmin';

const testEnv = functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);
let wrapped: any;
const db = admin.firestore();
let user: { uid: string; data: any; path: string };
let household: { id: string; data: any; path: string };

jest.mock('../../utils/alertAdmin');
describe('Add User to Household', () => {
  jest.setTimeout(30000);
  beforeAll(() => {
    wrapped = testEnv.wrap(joinHousehold);
  });
  afterAll(() => {
    testEnv.cleanup();
  });

  describe('Failed to add user to Household', () => {
    afterEach(async () => {
      await db.recursiveDelete(db.collection('users'));
      await db.recursiveDelete(db.collection('households'));
    });
    it('should throw if missing household id', async () => {
      await expect(async () => {
        await wrapped({}, { auth: { uid: 'user_1' } });
      }).rejects.toThrow(/missing household id/);
    });
    it('should throw when client submit an invalid user uid', async () => {
      household = {
        id: 'household_1',
        data: {},
        path: 'households/household_1',
      };
      await createDoc(household.data, household.path);

      await expect(
        wrapped({ household: household.id }, { auth: { uid: 'user_1' } })
      ).rejects.toThrow(/user not found/);
    });
    it('should throw when client submit an invalid household id', async () => {
      user = {
        uid: 'user_1',
        data: {},
        path: 'users/user_1',
      };
      await createDoc(user.data, user.path);

      await expect(
        wrapped({ household: 'household_id' }, { auth: { uid: user.uid } })
      ).rejects.toThrow(/household not found/);
    });
    it('should return failed when user trys to join household with service they already have', async () => {
      household = {
        id: 'household_id',
        path: 'households/household_id',
        data: { service: 'my_service', members: [] },
      };
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: { households: [{ service: household.data.service }] },
      };
      await createDoc(user.data, user.path);
      await createDoc(household.data, household.path);
      expect(
        (
          await wrapped(
            { household: household.id },
            { auth: { uid: user.uid } }
          )
        ).error.code
      ).toMatch(/ALREADY_HAS_SERVICE/);
    });
    it('should return failed when user trys to join household with insufficient balance', async () => {
      household = {
        id: 'household_id',
        path: 'households/household_id',
        data: { service: 'my_service', members: [], price: 1000 },
      };
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: { households: [], current_amount: 999 },
      };
      await createDoc(user.data, user.path);
      await createDoc(household.data, household.path);
      expect(
        (
          await wrapped(
            { household: household.id },
            { auth: { uid: user.uid } }
          )
        ).error.code
      ).toMatch(/INSUFFICIENT_BALANCE/);
    });
    it('should return failed when user trys to join household while already member', async () => {
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: { households: [] },
      };
      household = {
        id: 'household_id',
        path: 'households/household_id',
        data: { service: 'my_service', members: [{ id: user.uid }] },
      };
      await createDoc(user.data, user.path);
      await createDoc(household.data, household.path);

      expect(
        (
          await wrapped(
            { household: household.id },
            { auth: { uid: user.uid } }
          )
        ).error.code
      ).toMatch(/ALREADY_MEMBER/);
    });
    it('should return failed when user trys to join household that is already full and active', async () => {
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: { households: [] },
      };
      household = {
        id: 'household_id',
        path: 'households/household_id',
        data: {
          service: 'my_service',
          members: [],
          status: 'active',
        },
      };
      await createDoc(user.data, user.path);
      await createDoc(household.data, household.path);

      expect(
        (
          await wrapped(
            { household: household.id },
            { auth: { uid: user.uid } }
          )
        ).error.code
      ).toMatch(/HOUSEHOLD_ALREADY_FULL/);
    });
    it('should return failed when user trys to join promotion household', async () => {
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: { households: [] },
      };
      household = {
        id: 'household_id',
        path: 'households/household_id',
        data: { service: 'my_service', members: [], promo: true },
      };
      await createDoc(user.data, user.path);
      await createDoc(household.data, household.path);

      expect(
        (
          await wrapped(
            { household: household.id },
            { auth: { uid: user.uid } }
          )
        ).error.code
      ).toMatch(/IS_PROMO_HOUSEHOLD/);
    });
  });

  describe.only('Succesfull add user to Household', () => {
    let res: FunctionResponse;
    beforeAll(async () => {
      user = {
        uid: 'user_1',
        path: 'users/user_1',
        data: {
          current_amount: 2000,
          firstname: 'Jane',
          phone: 7825462,
          households: [
            {
              service: 'my_service',
              name: 'household 2',
              id: 'household_id-2',
            },
          ],
        },
      };
      household = {
        id: 'household_1',
        path: 'households/household_1',
        data: {
          service: 'netflix',
          price: 1000,
          name: 'household 1',
          members: [{ id: '9' }, { id: '8' }],
        },
      };
      await createDoc(user.data, user.path);
      await createDoc(household.data, household.path);
      res = await wrapped(
        { household: household.id },
        { auth: { uid: user.uid } }
      );
    });
    afterAll(async () => {
      await db.recursiveDelete(db.collection('users'));
      await db.recursiveDelete(db.collection('households'));
      await db.recursiveDelete(db.collection('reviews'));
    });
    it('should update user households with new household and increase reserved balance', async () => {
      const u = await db.doc(user.path).get();
      const { households, reserved } = u.data() as User;
      expect(households).toContainEqual({
        id: household.id,
        service: household.data.service,
        name: household.data.name,
      });
      expect(reserved).toEqual(household.data.price);
    });
    it('should update household with new member', async () => {
      const h = await db.doc(household.path).get();
      const { members } = h.data() as Household;
      expect(members).toContainEqual({
        id: user.uid,
        phone: user.data.phone,
        firstname: user.data.firstname,
      });
    });
    it('should return updated user households', async () => {
      expect(res.status).toEqual('success');
      expect(res.data?.households).toContainEqual({
        id: household.id,
        service: household.data.service,
        name: household.data.name,
      });
    });

    // TODO: Make this test better by breaking it up
    it.only('should set household status to active, create review and alert admin', async () => {
      const user_2 = { ...user, uid: 'user_2' };
      await db.doc('users/' + user_2.uid).create(user_2.data);
      await wrapped({ household: household.id }, { auth: { uid: user_2.uid } });
      const h = await db.doc(household.path).get();
      const r = await db.doc('reviews/' + household.id).get();
      const { status } = h.data() as Household;
      expect(status).toEqual('active');
      expect(r.exists).toBe(true);
      expect(alertAdmin).toBeCalled();
    });
  });
});

async function createDoc(data: { [key: string]: any }, path: string) {
  return await db.doc(path).create(data);
}
