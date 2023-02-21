import { User, Household } from '../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import leaveHousehold from '.';

const testEnv = functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);
async function createDoc(data: { [key: string]: any }, path: string) {
  return await admin.firestore().doc(path).create(data);
}

let wrapped: any;
describe('Remove User From Household', () => {
  jest.setTimeout(30000);
  beforeAll(() => {
    wrapped = testEnv.wrap(leaveHousehold);
  });
  afterEach(async () => {
    await admin.firestore().doc(`users/user_uid`).delete();
    await admin.firestore().doc(`households/household_id`).delete();
  });
  afterAll(() => {
    testEnv.cleanup();
  });
  it('should throw if missing user uid or household id', async () => {
    await expect(async () => {
      await wrapped({}, { auth: { uid: 'user_uid' } });
    }).rejects.toThrow(/missing household id/);
    await expect(async () => {
      await wrapped({ household: 'household_id' }, {});
    }).rejects.toThrow(/missing user uid/);
  });

  it('should throw when client submit unrecognised user uid or household id', async () => {
    await createDoc({ test: 1 }, '/households/household_id');
    await createDoc({ test: 1 }, '/users/user_uid');

    // correct household id and wrong user uid
    await expect(async () => {
      await wrapped(
        { household: 'household_id' },
        { auth: { uid: 'user_uid_wrong' } }
      );
    }).rejects.toThrow(/user not found/);

    // correct user uid and wrong household id
    await expect(async () => {
      await wrapped(
        { household: 'household_id_wrong' },
        { auth: { uid: 'user_uid' } }
      );
    }).rejects.toThrow(/household not found/);
  });

  it('should return failed when user trys to leave household while not member', async () => {
    await createDoc({ households: [], current_amount: 999 }, 'users/user_uid');
    await createDoc(
      {
        service: 'my_other_service',
        price: 1000,
        members: [{ id: 'user_uid-2' }],
      },
      'households/household_id'
    );
    expect(
      (
        await wrapped(
          { household: 'household_id' },
          { auth: { uid: 'user_uid' } }
        )
      ).error.code
    ).toMatch(/NOT_MEMBER/);
  });

  it('should return failed when user trys to leave household while service is active', async () => {
    await createDoc(
      {
        households: [{ id: 'household_id' }],
        current_amount: 999,
      },
      'users/user_uid'
    );
    await createDoc(
      {
        service: 'my_other_service',
        members: [{ id: 'user_uid' }],
        status: 'active',
      },
      'households/household_id'
    );
    expect(
      (
        await wrapped(
          { household: 'household_id' },
          { auth: { uid: 'user_uid' } }
        )
      ).error.code
    ).toMatch(/SERVICE_ACTIVE/);
  });

  it('should remove user from household', async () => {
    await createDoc(
      {
        reserved: 4000,
        households: [
          {
            id: 'household_id',
          },
        ],
      },
      'users/user_uid'
    );
    await createDoc(
      {
        price: 1000,
        status: 'inactive',
        members: [
          {
            id: 'user_uid',
          },
        ],
      },
      'households/household_id'
    );
    const res = await wrapped(
      { household: 'household_id' },
      { auth: { uid: 'user_uid' } }
    );
    const userDoc = await admin.firestore().doc('/users/user_uid').get();
    const householdDoc = await admin
      .firestore()
      .doc('/households/household_id')
      .get();

    // User should nolonger have reffernce to household
    expect((userDoc.data() as User).households).toEqual([]);

    // Revered amount should reduce by service price
    expect((userDoc.data() as User).reserved).toEqual(3000);

    // Household should nolonger have refference to user
    expect((householdDoc.data() as Household).members).toEqual([]);

    // User should nolonger have reffernce to household
    expect(res).toEqual({
      status: 'success',
      data: {
        households: [],
      },
    });
  });
});
