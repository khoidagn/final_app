import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logInfo, logError } from './logging.js';

const SERVICE_NAME = 'MailService';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

let cachedTransporter: nodemailer.Transporter | null = null;

const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (cachedTransporter) return cachedTransporter;

  const { smtpUser, smtpPass, smtpHost, smtpPort, smtpSecure } = config.mail;

  if (smtpUser && smtpPass) {
    logInfo(
      SERVICE_NAME,
      `Email Service operating mode: PRODUCTION/REAL MAIL (${smtpUser})`
    );

    const isSecure = smtpSecure || Number(smtpPort) === 465;

    cachedTransporter = nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: Number(smtpPort) || 465,
      secure: isSecure,
      auth: {
        user: smtpUser.trim(),
        pass: smtpPass.trim().replace(/\s+/g, ''),
      },
      family: 4,
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    } as nodemailer.TransportOptions);
  } else {
    logInfo(
      SERVICE_NAME,
      'Email Service operating mode: ETHEREAL TEST (SMTP_USER/PASS not configured)'
    );
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return cachedTransporter;
};

export const MailService = {
  sendEmail: async ({
    to,
    subject,
    html,
  }: SendMailOptions): Promise<boolean> => {
    try {
      const transporter = await getTransporter();

      const info = await transporter.sendMail({
        from:
          config.mail.smtpFrom || `"Fotobook System" <${config.mail.smtpUser}>`,
        to,
        subject,
        html,
      });

      logInfo(
        SERVICE_NAME,
        `Email dispatched successfully to: ${to} (MessageId: ${info.messageId})`
      );
      return true;
    } catch (error: any) {
      logError(
        SERVICE_NAME,
        `[SMTP ERROR] Failed to send email to ${to}. Reason: ${error?.message || error}`
      );
      if (error?.response) {
        logError(
          SERVICE_NAME,
          `[SMTP RESPONSE]: ${JSON.stringify(error.response)}`
        );
      }

      throw new Error(
        `Email dispatch failed: ${error?.message || 'Unknown SMTP error'}`
      );
    }
  },
};
