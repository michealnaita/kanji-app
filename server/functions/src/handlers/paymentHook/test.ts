import request from 'supertest';
import paymentHook, { app } from '.';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const mockHandleTx = jest.fn();
jest.mock('./utils', () => ({
  handleTransactionFulfillment: () => mockHandleTx(),
}));
describe('Payment Webhook', () => {
  let app: express.Express;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(paymentHook);
  });
  afterEach(() => {
    mockHandleTx.mockClear();
  });
  mockHandleTx.mockClear();
  describe('GET', () => {
    it('should redirect to 500 page when error occurs', async () => {
      mockHandleTx.mockRejectedValue(new Error());
      const response = await request(app)
        .get('/')
        .query({ transaction_id: 'tx_id', tx_ref: 'tx_ref' });
      expect(response.status).toEqual(302);
      expect(response.headers['location']).toMatch(/\/500/);
    });
    it('should redirect user to success page if transaction is successful', async () => {
      mockHandleTx.mockResolvedValue('success');
      const response = await request(app)
        .get('/')
        .query({ transaction_id: 'tx_id', tx_ref: 'tx_ref' });
      expect(response.status).toEqual(302);
      expect(response.headers['location']).toMatch(/recharge\?status=success/);
    });
    it('should redirect user to fail page if transaction failed', async () => {
      mockHandleTx.mockResolvedValue('fail');
      const response = await request(app)
        .get('/')
        .query({ transaction_id: 'tx_id', tx_ref: 'tx_ref' });
      expect(response.status).toEqual(302);
      expect(response.headers['location']).toMatch(/recharge\?status=fail/);
    });
  });
  describe('POST', () => {
    let response: request.Response;
    beforeAll(async () => {
      response = await request(app)
        .post('/')
        .send({
          event: 'charge.completed',
          data: {
            id: 'tx_id',
            tx_ref: 'tx_ref',
          },
        });
    });
    test('should call function to handle transaction fulfillment', () => {
      expect(mockHandleTx).toBeCalledTimes(1);
    });
    test('should resond with a status of 200', () => {
      expect(response.status).toEqual(200);
    });
  });
});
