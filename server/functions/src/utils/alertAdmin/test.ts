import alert from '.';
import dotenv from 'dotenv';
dotenv.config();
const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: mockSendMail,
  }),
}));
describe('Alert User', () => {
  jest.setTimeout(30000);
  test('should alert admin through email', async () => {
    await alert('0987654321');
    expect(mockSendMail).toBeCalled();
  });
});
