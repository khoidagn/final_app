import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logInfo, logError } from './logging.js';

const SERVICE_NAME = 'MailService';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const createTransporter = async () => {
  const { smtpUser, smtpPass, smtpHost, smtpPort, smtpSecure } = config.mail;

  if (smtpUser && smtpPass) {
    logInfo(
      SERVICE_NAME,
      `Email Service operating mode: PRODUCTION/REAL MAIL (${smtpUser})`
    );
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } else {
    logInfo(
      SERVICE_NAME,
      'Email Service operating mode: ETHEREAL TEST (SMTP_USER/PASS not configured)'
    );
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

export const MailService = {
  sendEmail: async ({
    to,
    subject,
    html,
  }: SendMailOptions): Promise<boolean> => {
    try {
      const transporter = await createTransporter();

      const info = await transporter.sendMail({
        from: config.mail.smtpFrom,
        to,
        subject,
        html,
      });

      logInfo(SERVICE_NAME, `Email dispatched successfully to: ${to}`);

      const testUrl = nodemailer.getTestMessageUrl(info);
      if (testUrl) {
        logInfo(SERVICE_NAME, `Ethereal Test Mail URL: ${testUrl}`);
      }

      return true;
    } catch (error: any) {
      logError(
        SERVICE_NAME,
        `Failed to dispatch email to ${to}. Details: ${error?.message || error}`
      );
      return false;
    }
  },
};
