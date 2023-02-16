import axios from 'axios';
import dotenv from 'dotenv';
import functions from 'firebase-functions-test';
import generateRechargeLink, {
  PaymentRequestData,
  FlutterwaveResponse,
} from './index';
dotenv.config();
const testEnv = functions();
jest.mock('axios');
jest.mock('firebase-admin');
const resolvedValue: { data: FlutterwaveResponse } = {
  data: {
    status: 'success',
    message: 'Hosted Link',
    data: {
      link: 'https://example.com/test',
    },
  },
};
axios.post = jest.fn().mockResolvedValue(resolvedValue);

const wrapped = testEnv.wrap(generateRechargeLink);
describe('Generate Payment Link', () => {
  afterAll(() => {
    testEnv.cleanup();
  });
  it('Should generate payment link', async () => {
    const data: PaymentRequestData = {
      amount: '5000',
      name: 'Test User',
      email: 'testuser@gmail.com',
      phone: '772945846',
    };
    const auth = {
      uid: '9876543234567890',
    };
    expect((await wrapped(data, { auth })).status).toMatch(/success/);
  });
  it('Should throw if client doesnt submit all user details', async () => {
    const data: PaymentRequestData = {
      amount: '5000',
      email: 'testuser@gmail.com',
      phone: '772945846',
    };
    const auth = {
      uid: '9876543234567890',
    };
    expect(async () => {
      await wrapped(data, { auth });
    }).rejects.toThrow(/provide all user details/);
  });
});
