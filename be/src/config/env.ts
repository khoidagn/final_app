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
  },
  database: {
    url: getEnvVar('DATABASE_URL'),
  },
  jwt: {
    accessSecret: getEnvVar('JWT_ACCESS_SECRET'),
    accessExpiresIn: getEnvVar('JWT_ACCESS_EXPIRES_IN', false) || '15m',
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', false) || '7d',
  },
} as const;

export default config;
