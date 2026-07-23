import dotenv from 'dotenv';
import { logError } from '../utils/logging.js';
dotenv.config();

const getEnvVar = (key: string, required = true): string => {
  const value = process.env[key];
  if (required && (!value || value.trim() === '')) {
    logError('Config', `Missing required environment variable: ${key}`);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};

const port = parseInt(process.env.PORT || '3002', 10);

export const config = {
  app: {
    env: getEnvVar('NODE_ENV', false) || 'development',
    port: port,
    host: process.env.HOST || `http://localhost:${port}`,
    frontendHost: process.env.FRONTEND_HOST || 'http://localhost:5173',
  },
  database: {
    url: getEnvVar('DATABASE_URL'),
  },
  jwt: {
    accessSecret: getEnvVar('JWT_ACCESS_SECRET'),
    accessExpiresIn: getEnvVar('JWT_ACCESS_EXPIRES_IN', false) || '15m',
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', false) || '7d',
    verificationSecret:
      getEnvVar('JWT_VERIFICATION_SECRET', false) ||
      'default_verification_secret_key',
    resetPasswordSecret:
      getEnvVar('JWT_RESET_PASSWORD_SECRET', false) ||
      'default_reset_password_secret_key',
  },
  cloudinary: {
    cloudName: getEnvVar('CLOUDINARY_CLOUD_NAME'),
    apiKey: getEnvVar('CLOUDINARY_API_KEY'),
    apiSecret: getEnvVar('CLOUDINARY_API_SECRET'),
    folder: getEnvVar('CLOUDINARY_FOLDER', false) || 'upload-finalapp',
  },
  mail: {
    smtpHost: getEnvVar('SMTP_HOST', false) || 'smtp.gmail.com',
    smtpPort: parseInt(getEnvVar('SMTP_PORT', false) || '587', 10),
    smtpSecure: getEnvVar('SMTP_SECURE', false) === 'true',
    smtpUser: getEnvVar('SMTP_USER', false),
    smtpPass: getEnvVar('SMTP_PASS', false),
    smtpFrom:
      getEnvVar('SMTP_FROM', false) ||
      '"Fotobook System" <noreply@fotobook.com>',
  },
} as const;

export default config;
