import axios from 'axios';
import dotenv from 'dotenv';
import test from 'firebase-functions-test';
import generateRechargeLink, {
  PaymentRequestData,
  FlutterwaveResponse,
} from './index';
dotenv.config();

jest.mock('axios');
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

const wrapped = test().wrap(generateRechargeLink);
describe('Generate Payment Link', () => {
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
