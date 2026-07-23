import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { MailService } from '../utils/mail.js';
import { MailTemplates } from '../utils/mail-templates.js';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../middlewares/error.middleware.js';
import { logError, logInfo, logWarning } from '../utils/logging.js';
import { config } from '../config/env.js';
import { Role } from '@prisma/client';

const SERVICE_NAME = 'AuthService';

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
    logInfo(
      SERVICE_NAME,
      `Registering new account attempt for email: ${signupData.email}`
    );

    const existingUser = await prisma.user.findUnique({
      where: { email: signupData.email },
    });
    if (existingUser) {
      logWarning(
        SERVICE_NAME,
        `Registration rejected - Email already exists: ${signupData.email}`
      );
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

    const verificationUrl = `${config.app.frontendHost}/verify-email?token=${verificationToken}`;

    try {
      await MailService.sendEmail({
        to: newUser.email,
        subject: '[Fotobook] Verify your email address',
        html: MailTemplates.getVerificationEmail({
          firstName: newUser.firstName,
          verificationUrl,
        }),
      });
      logInfo(
        SERVICE_NAME,
        `Verification email dispatched successfully for User ID: ${newUser.id}`
      );
    } catch (mailError) {
      logError(
        SERVICE_NAME,
        `Failed to send verification email to ${newUser.email}: ${mailError}`
      );
    }

    return { user: newUser };
  },

  verifyEmail: async (token: string) => {
    logInfo(SERVICE_NAME, 'Email verification checkpoint initiated');

    try {
      const decoded = jwt.verify(token, config.jwt.verificationSecret) as {
        userId: number;
        email: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) {
        logError(
          SERVICE_NAME,
          `Email verification failed - User ID ${decoded.userId} not found`
        );
        throw new AppError(404, 'User not found.');
      }

      if (user.confirmedAt) {
        logWarning(
          SERVICE_NAME,
          `Email verification redundant - User ID ${user.id} already verified`
        );
        throw new AppError(400, 'Email is already verified.');
      }

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { confirmedAt: new Date() },
      });

      logInfo(
        SERVICE_NAME,
        `Email verified successfully for User ID: ${decoded.userId}`
      );
      return { message: 'Email verified successfully. You can now log in.' };
    } catch (error: any) {
      logError(SERVICE_NAME, `Email verification failed: ${error.message}`);
      throw new AppError(400, 'Verification link is invalid or has expired.');
    }
  },

  resendVerification: async (email: string) => {
    logInfo(SERVICE_NAME, `Request to resend verification email for: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logWarning(
        SERVICE_NAME,
        `Resend verification aborted - User email ${email} not found`
      );
      throw new AppError(404, 'User not found.');
    }

    if (user.confirmedAt) {
      logWarning(
        SERVICE_NAME,
        `Resend verification rejected - User email ${email} already verified`
      );
      throw new AppError(400, 'Email is already verified.');
    }

    const verificationToken = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.verificationSecret,
      { expiresIn: '1h' }
    );

    const verificationUrl = `${config.app.frontendHost}/verify-email?token=${verificationToken}`;

    await MailService.sendEmail({
      to: user.email,
      subject: '[Fotobook] Verify your email address',
      html: MailTemplates.getVerificationEmail({
        firstName: user.firstName,
        verificationUrl,
      }),
    });

    logInfo(
      SERVICE_NAME,
      `Verification email resent successfully to User ID: ${user.id}`
    );
    return { message: 'Verification email resent successfully.' };
  },

  checkVerificationStatus: async (email: string) => {
    logInfo(SERVICE_NAME, `Checking verification status for email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { confirmedAt: true },
    });
    if (!user) {
      logWarning(
        SERVICE_NAME,
        `Verification status check failed - User email ${email} not found`
      );
      throw new AppError(404, 'User not found.');
    }
    return {
      email,
      isConfirmed: user.confirmedAt !== null,
    };
  },

  login: async (credentials: { email: string; password: string }) => {
    logInfo(
      SERVICE_NAME,
      `Login attempt initiated for email: ${credentials.email}`
    );

    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });
    if (!user || !user.isActive) {
      logWarning(
        SERVICE_NAME,
        `Login rejected - Account does not exist or suspended for email: ${credentials.email}`
      );
      throw new AppError(401, 'Account does not exist or has been deactivated');
    }
    if (!user.confirmedAt) {
      logWarning(
        SERVICE_NAME,
        `Login rejected - Email unverified for User ID: ${user.id}`
      );
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
      logWarning(
        SERVICE_NAME,
        `Login rejected - Password mismatch for User ID: ${user.id}`
      );
      throw new AppError(401, 'Incorrect password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    logInfo(SERVICE_NAME, `User logged in successfully. User ID: ${user.id}`);
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
    logInfo(SERVICE_NAME, 'Session token refresh requested');

    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as {
        id: number;
      };

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || !user.isActive) {
        logWarning(
          SERVICE_NAME,
          `Refresh session failed - User ID ${decoded.id} no longer exists or is deactivated`
        );
        throw new AppError(401, 'User no longer exists or is deactivated');
      }

      const newAccessToken = generateAccessToken(user.id, user.role);
      logInfo(
        SERVICE_NAME,
        `Access token refreshed successfully for User ID: ${user.id}`
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      logError(
        SERVICE_NAME,
        'Failed to refresh session: ' + (error as Error).message
      );
      throw new AppError(401, 'Invalid or expired refresh token');
    }
  },

  forgotPassword: async (email: string) => {
    logInfo(SERVICE_NAME, `Password reset link request for email: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logWarning(
        SERVICE_NAME,
        `Forgot password aborted - Email address not found: ${email}`
      );
      throw new AppError(404, 'Email address not found.');
    }

    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.resetPasswordSecret,
      { expiresIn: '15m' }
    );

    const resetPasswordUrl = `${config.app.frontendHost}/reset-password?token=${resetToken}`;

    try {
      await MailService.sendEmail({
        to: user.email,
        subject: '[Fotobook] Reset Your Password',
        html: MailTemplates.getResetPasswordEmail({
          firstName: user.firstName,
          resetPasswordUrl,
        }),
      });
      logInfo(
        SERVICE_NAME,
        `Password reset link dispatched successfully to email: ${user.email}`
      );
    } catch (mailError) {
      logError(
        SERVICE_NAME,
        `Failed to send reset password email to ${user.email}: ${mailError}`
      );
      throw new AppError(
        500,
        'Could not send reset password email. Please try again later.'
      );
    }

    return { message: 'Password reset link has been sent to your email.' };
  },

  resetPassword: async (token: string, passwordRaw: string) => {
    logInfo(SERVICE_NAME, 'Password correction execution initiated');

    try {
      const decoded = jwt.verify(token, config.jwt.resetPasswordSecret) as {
        userId: number;
      };

      const hashedPassword = await bcrypt.hash(passwordRaw, 10);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { passwordHash: hashedPassword },
      });

      logInfo(
        SERVICE_NAME,
        `Password updated successfully in database for User ID: ${decoded.userId}`
      );
      return {
        message:
          'Password has been successfully reset. You can now log in with your new password.',
      };
    } catch (error: any) {
      logError(
        SERVICE_NAME,
        `Password reset transaction failed: ${error.message}`
      );
      throw new AppError(400, 'Reset token is invalid or has expired.');
    }
  },
};
