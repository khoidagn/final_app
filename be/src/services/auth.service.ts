import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { MailService } from '../utils/mail.js';
import { MailTemplates } from '../utils/mail-templates.js';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../middlewares/error.middleware.js';
import { logError } from '../utils/logging.js';
import { config } from '../config/env.js';
import { Role } from '@prisma/client';

const generateAccessToken = (userId: number, role: Role): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.accessExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign({ id: userId, role }, config.jwt.accessSecret, options);
};

const generateRefreshToken = (userId: number): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign({ id: userId }, config.jwt.refreshSecret, options);
};

export const authService = {
  register: async (signupData: any) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: signupData.email },
    });
    if (existingUser) {
      throw new AppError(400, 'Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        passwordHash: hashedPassword,
        isActive: true,
      },
    });

    const verificationToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      config.jwt.verificationSecret,
      { expiresIn: '1h' }
    );

    const verificationUrl = `${config.app.host}/api/v1/auth/verify-email?token=${verificationToken}`;

    MailService.sendEmail({
      to: newUser.email,
      subject: '[Fotobook] Verify your email address',
      html: MailTemplates.getVerificationEmail({
        firstName: newUser.firstName,
        verificationUrl,
      }),
    });

    return { user: newUser };
  },

  verifyEmail: async (token: string) => {
    try {
      const decoded = jwt.verify(token, config.jwt.verificationSecret) as {
        userId: number;
        email: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) {
        throw new AppError(404, 'User not found.');
      }

      if (user.confirmedAt) {
        throw new AppError(400, 'Email is already verified.');
      }

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { confirmedAt: new Date() },
      });

      return { message: 'Email verified successfully. You can now log in.' };
    } catch (_error: any) {
      throw new AppError(400, 'Verification link is invalid or has expired.');
    }
  },

  resendVerification: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, 'User not found.');
    }

    if (user.confirmedAt) {
      throw new AppError(400, 'Email is already verified.');
    }

    const verificationToken = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.verificationSecret,
      { expiresIn: '1h' }
    );

    const verificationUrl = `${config.app.host || 'http://localhost:3002'}/api/v1/auth/verify-email?token=${verificationToken}`;

    await MailService.sendEmail({
      to: user.email,
      subject: '[Fotobook] Verify your email address',
      html: MailTemplates.getVerificationEmail({
        firstName: user.firstName,
        verificationUrl,
      }),
    });

    return { message: 'Verification email resent successfully.' };
  },

  login: async (credentials: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });
    if (!user || !user.isActive) {
      throw new AppError(401, 'Account does not exist or has been deactivated');
    }
    if (!user.confirmedAt) {
      throw new AppError(
        401,
        'Please verify your email address before signing in.'
      );
    }
    const isPasswordMatch = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );
    if (!isPasswordMatch) {
      throw new AppError(401, 'Incorrect password');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },

  refreshSession: async (token: string) => {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'default_refresh_secret'
      ) as { id: number };

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || !user.isActive) {
        throw new AppError(401, 'User no longer exists or is deactivated');
      }

      const newAccessToken = generateAccessToken(user.id, user.role);
      return { accessToken: newAccessToken };
    } catch (error) {
      logError(
        'AuthService',
        'Failed to refresh session: ' + (error as Error).message
      );
      throw new AppError(401, 'Invalid or expired refresh token');
    }
  },
};
