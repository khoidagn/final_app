import nodemailer from 'nodemailer';
import { logInfo, logError } from './logging.js';

const SERVICE_NAME = 'MailService';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const MailService = {
  /**
   * Sends an email via automated Ethereal Email account for development and testing environments.
   */
  sendEmail: async ({
    to,
    subject,
    html,
  }: SendMailOptions): Promise<boolean> => {
    try {
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: '"Fotobook System" <noreply@fotobook.com>',
        to,
        subject,
        html,
      });

      logInfo(SERVICE_NAME, `Email dispatched successfully to: ${to}`);
      logInfo(
        SERVICE_NAME,
        `Ethereal URL: ${nodemailer.getTestMessageUrl(info)}`
      );

      return true;
    } catch (error: any) {
      logError(
        SERVICE_NAME,
        `Failed to dispatch email to ${to}. Details: ${error.message}`
      );
      return false;
    }
  },
};
