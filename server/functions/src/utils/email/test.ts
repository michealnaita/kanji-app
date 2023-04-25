import { UserEmail, TEMPLATES } from './email';

describe('User Email Client', () => {
  const sendMock = jest.fn();
  UserEmail.prototype.send = sendMock;
  const email = new UserEmail({ email: 'user@example.com', name: 'User' });
  it('should send account deletiton email ', () => {
    email.onDelete().send();
    expect(email._template).toBe(TEMPLATES.onDelete);
    expect(sendMock).toBeCalled();
  });
  it('should send service joining email ', () => {
    email.onJoinService('spotify').send();
    expect(email._template).toBe(TEMPLATES.onJoinService);
    expect(sendMock).toBeCalled();
  });
  it('should send service activation email ', () => {
    email
      .onActiveService({
        service: 'spotify',
        start: '2023-04-04',
        end: '2023-05-04',
        link: 'https://link.com',
        address: 'home',
      })
      .send();
    expect(email._template).toBe(TEMPLATES.onActiveService);
    expect(sendMock).toBeCalled();
  });
});
