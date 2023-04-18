import nodemailer from 'nodemailer';
export default async function alert(id: string) {
  try {
    const { CLIENT, PASS, APP_NAME, ADMIN } = process.env;
    const transport = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      auth: {
        user: CLIENT,
        pass: PASS,
      },
    });
    const options = {
      from: `${APP_NAME} <kanji.app@pixelinegroup.com>`,
      to: ADMIN,
      subject: 'New Review Request',
      text: 'New review Request for household with id ' + id,
    };
    await transport.sendMail(options);
  } catch (e: any) {
    console.log(e.message);
  }
}

export async function alertAdmin(action: 'new-subscription', meta: any) {
  try {
    const { CLIENT, PASS, APP_NAME, ADMIN } = process.env;
    const transport = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      auth: {
        user: CLIENT,
        pass: PASS,
      },
    });
    const options = {
      from: `${APP_NAME} <kanji.app@pixelinegroup.com>`,
      to: ADMIN,
      subject: 'New Review Request',
      text: 'New subscription for' + meta.id,
    };
    await transport.sendMail(options);
  } catch (e: any) {
    console.log(e.message);
  }
}
