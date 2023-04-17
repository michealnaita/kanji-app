import admin from 'firebase-admin';
import functions from 'firebase-functions-test';
import deleteUser from '.';
import { FunctionResponse } from '../../utils/types';
const testEnv = functions(
  {
    projectId: 'pinocchio-40489',
  },
  './service-account.json'
);

let wrapped: any;
const db = admin.firestore();
const auth = admin.auth();

describe('Delete User Account', () => {
  jest.setTimeout(30000);
  const user = {
    uid: 'user_1',
    path: 'users/user_1',
    data: {
      email: 'user@test.com',
      firstname: 'User',
      phone: 1234567,
    },
  };
  beforeAll(async () => {
    wrapped = testEnv.wrap(deleteUser);
    // await db.doc(user.path).create(user.data);
  });
  beforeEach(async () => {});
  afterEach(async () => {
    // await db.doc(user.path).delete();
  });
  it.only('Should throw Error if client unauthenticated', async () => {
    const ctx = {};
    await expect(wrapped({}, ctx)).rejects.toThrow(/IS_UNAUTHENTICATED/);
  });
  it.only('Should throw Error if user was not found', async () => {
    const ctx = {
      auth: {
        uid: 'user_2',
      },
    };
    await expect(wrapped({}, ctx)).rejects.toThrow(/USER_NOT_FOUND/);
  });
  it.only('Should delete user accounts data from firebase firestore and firebase auth', async () => {
    const userRecord = await auth.createUser({ email: user.data.email });
    user.uid = userRecord.uid;
    await db.doc('users/' + user.uid).create(user.data);
    const ctx = {
      auth: {
        uid: user.uid,
      },
    };
    const res: FunctionResponse = await wrapped({}, ctx);
    await expect(auth.getUser(user.uid)).rejects.toThrow();
    expect((await db.doc('users/' + user.uid).get()).exists).toEqual(false);
    expect(res.status).toEqual('success');
    await db.doc('users/' + user.uid).delete();
  });
});
