import { User, Household } from '../../utils/types';
import functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import joinHousehold from '.';

const testEnv = functions(
  {
    projectId: 'kanji-app-a5036',
  },
  './service-account.json'
);
let wrapped: any;
describe('Add User to Household', () => {
  jest.setTimeout(30000);
  beforeAll(() => {
    wrapped = testEnv.wrap(joinHousehold);
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
  it('should throw when client submit an recognised user uid or household id', async () => {
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
  it('should return failed when user trys to join household with service they already have', async () => {
    await createDoc(
      { households: [{ service: 'my_service' }] },
      'users/user_uid'
    );
    await createDoc(
      { service: 'my_service', members: [] },
      'households/household_id'
    );

    expect(
      await wrapped(
        { household: 'household_id' },
        { auth: { uid: 'user_uid' } }
      )
    ).toEqual({ status: 'fail', error: { code: 'ALREADY_HAS_SERVICE' } });
  });
  it('should return failed when user trys to join household with insufficient balance', async () => {
    await createDoc(
      { households: [{ service: 'my_service' }], current_amount: 999 },
      'users/user_uid'
    );
    await createDoc(
      { service: 'my_other_service', price: 1000, members: [] },
      'households/household_id'
    );
    expect(
      await wrapped(
        { household: 'household_id' },
        { auth: { uid: 'user_uid' } }
      )
    ).toEqual({ status: 'fail', error: { code: 'INSUFFICIENT_BALANCE' } });
  });
  it('should return failed when user trys to join household while already member', async () => {
    await createDoc(
      { households: [{ service: 'my_service' }], current_amount: 9999 },
      'users/user_uid'
    );
    await createDoc(
      {
        service: 'my_other_service',
        price: 1000,
        members: [{ id: 'user_uid' }],
      },
      'households/household_id'
    );
    expect(
      await wrapped(
        { household: 'household_id' },
        { auth: { uid: 'user_uid' } }
      )
    ).toEqual({ status: 'fail', error: { code: 'ALREADY_MEMBER' } });
  });
  it('should add user to household', async () => {
    await createDoc(
      {
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
      'users/user_uid'
    );
    await createDoc(
      {
        service: 'my_other_service',
        price: 1000,
        name: 'household 1',
        members: [],
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

    expect((userDoc.data() as User).households[1]).toEqual({
      id: 'household_id',
      service: 'my_other_service',
      name: 'household 1',
    });
    expect((userDoc.data() as User).reserved).toEqual(1000);
    expect((householdDoc.data() as Household).members[0]).toEqual({
      id: 'user_uid',
      phone: 7825462,
      firstname: 'Jane',
    });
    expect(res).toEqual({
      status: 'success',
      data: {
        households: [
          {
            id: 'household_id-2',
            service: 'my_service',
            name: 'household 2',
          },
          {
            id: 'household_id',
            service: 'my_other_service',
            name: 'household 1',
          },
        ],
      },
    });
  });
});

async function createDoc(data: { [key: string]: any }, path: string) {
  return await admin.firestore().doc(path).create(data);
}
