import sgMail from '@sendgrid/mail';
import { config } from '../config/env.js';
import { logInfo, logError } from './logging.js';

const SERVICE_NAME = 'MailService';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const apiKey = config.mail.apiKey;

if (apiKey) {
  sgMail.setApiKey(apiKey.trim().replace(/\s+/g, ''));
  logInfo(SERVICE_NAME, 'SendGrid Web API initialized successfully.');
} else {
  logError(
    SERVICE_NAME,
    'SendGrid API Key is missing! Check your environment variables.'
  );
}

export const MailService = {
  sendEmail: async ({
    to,
    subject,
    html,
  }: SendMailOptions): Promise<boolean> => {
    try {
      const fromEmail =
        config.mail.smtpFrom || 'Rosy Fotobook <rosyfotobook@gmail.com>';

      const msg = {
        to,
        from: fromEmail,
        subject,
        html,
      };

      const [response] = await sgMail.send(msg);

      logInfo(
        SERVICE_NAME,
        `Email dispatched successfully via Web API to: ${to} (StatusCode: ${response.statusCode})`
      );
      return true;
    } catch (error: any) {
      logError(
        SERVICE_NAME,
        `[SendGrid Web API ERROR] Failed to send email to ${to}. Reason: ${
          error?.message || error
        }`
      );

      if (error?.response?.body) {
        logError(
          SERVICE_NAME,
          `[SendGrid Error Details]: ${JSON.stringify(error.response.body)}`
        );
      }

      throw new Error(
        `Email dispatch failed: ${error?.message || 'Unknown SendGrid API error'}`
      );
    }
  },
};
