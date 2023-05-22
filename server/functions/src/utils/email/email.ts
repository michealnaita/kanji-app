import * as Sib from '@sendinblue/client';
import fs from 'fs';
import path from 'path';
import * as functions from 'firebase-functions';

const emailApi = new Sib.TransactionalEmailsApi();

emailApi.setApiKey(
  Sib.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SIB_API_KEY || 'api_key'
);
export const TEMPLATES = {
  onDelete: fs.readFileSync(
    path.join(__dirname, '../../', 'templates', 'delete.html'),
    {
      encoding: 'utf8',
      flag: 'r',
    }
  ),
  onJoinService: fs.readFileSync(
    path.join(__dirname, '../../', 'templates', 'join-service.html'),
    { encoding: 'utf8', flag: 'r' }
  ),
  onActiveService: fs.readFileSync(
    path.join(__dirname, '../../', 'templates', 'active-service.html'),
    { encoding: 'utf8', flag: 'r' }
  ),
  newRequest: fs.readFileSync(
    path.join(__dirname, '../../', 'templates', 'new-request.html'),
    { encoding: 'utf8', flag: 'r' }
  ),
  extendSubscription: fs.readFileSync(
    path.join(__dirname, '../../', 'templates', 'extend-subscription.html'),
    { encoding: 'utf8', flag: 'r' }
  ),
};
class Email {
  _action: string = '';
  _email: string;
  _name: string;
  _template: string = '';
  _subject: string = '';
  _sender: { email: string; name: string } = { email: '', name: '' };
  _params: { [key: string]: string } = {};
  constructor({ email, name }: { email: string; name: string }) {
    this._email = email;
    this._name = name;
  }
  async send() {
    if (this._template == '') {
      throw new Error('send should be called after an action');
    }
    const settings: Sib.SendSmtpEmail = {
      htmlContent: this._template,
      params: {
        ...this._params,
      },
      sender: this._sender,
      subject: this._subject,

      to: [{ email: this._email, name: this._name }],
    };

    emailApi
      .sendTransacEmail(settings)
      .then((_) => {
        if (process.env.NODE_ENV !== 'testing')
          functions.logger.log(`email sent to ${this._email}`, {
            email_type: this._action,
          });
      })
      .catch((e) => {
        console.log(e);
        functions.logger.error(e);
      });
  }
}
export class AdminEmail extends Email {
  constructor() {
    const config = { email: 'admin@loscribe.com', name: 'Admin' };
    super(config);
  }
  onNewRequest({
    username,
    service,
    uid,
    email,
  }: {
    username: string;
    service: string;
    uid: string;
    email: string;
  }) {
    this._action = 'service request';
    this._template = TEMPLATES.newRequest;
    this._subject = 'New Subscription Request';
    this._sender = { email: 'no-reply@loscribe.com', name: 'Loscribe' };
    this._params = { NAME: username, EMAIL: email, UID: uid, SERVICE: service };
    return this;
  }
  onExtendSubscription({
    username,
    service,
    uid,
    email,
    duration,
  }: {
    username: string;
    service: string;
    uid: string;
    email: string;
    duration: number;
  }) {
    this._action = 'extend subscription';
    this._template = TEMPLATES.extendSubscription;
    this._subject = 'User Extened Service Subscription';
    this._sender = { email: 'no-reply@loscribe.com', name: 'Loscribe' };
    this._params = {
      NAME: username,
      EMAIL: email,
      UID: uid,
      SERVICE: service,
      DURATION: duration.toString(),
    };
    return this;
  }
}

export class UserEmail extends Email {
  constructor(config: { email: string; name: string }) {
    super(config);
  }
  onDelete() {
    this._action = 'delete account';
    this._template = TEMPLATES.onDelete;
    this._subject = 'Sad to see you go';
    this._sender = { email: 'no-reply@loscribe.com', name: 'Loscribe' };
    this._params = { NAME: this._name };
    return this;
  }
  onJoinService(service: string) {
    this._action = 'join service';
    this._template = TEMPLATES.onJoinService;
    this._subject = `Good News, you have joined ${service} with loscribe`;
    this._sender = { email: 'notifications@loscribe.com', name: 'Loscribe' };
    this._params = { NAME: this._name, SERVICE: service };
    return this;
  }
  onActiveService({
    service,
    start,
    end,
    link,
    address,
  }: {
    service: string;
    start: string;
    end: string;
    link: string;
    address: string;
  }) {
    this._action = 'activate service';
    this._template = TEMPLATES.onActiveService;
    this._subject = `Activate your ${service} Premium`;
    this._sender = { email: 'notifications@loscribe.com', name: 'Loscribe' };
    this._params = {
      NAME: this._name,
      SERVICE: service,
      START: start,
      END: end,
      LINK: link,
      ADDRESS: address,
    };
    return this;
  }
}
