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

    try {
      await MailService.sendEmail({
        to: newUser.email,
        subject: '[Fotobook] Verify your email address',
        html: MailTemplates.getVerificationEmail({
          firstName: newUser.firstName,
          verificationUrl,
        }),
      });
    } catch (mailError) {
      logError(
        'AuthService',
        `Failed to send verification email to ${newUser.email}: ${mailError}`
      );
    }

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

  checkVerificationStatus: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { confirmedAt: true },
    });
    if (!user) {
      throw new AppError(404, 'User not found.');
    }
    return {
      email,
      isConfirmed: user.confirmedAt !== null,
    };
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

// 📧 1. Yêu cầu đặt lại mật khẩu (Forgot Password)
  forgotPassword: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, 'Email address not found.');
    }

    // Sinh Reset Token bằng JWT với thời hạn ngắn (15 phút)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.resetPasswordSecret || 'your_reset_secret',
      { expiresIn: '15m' }
    );

    // Đường dẫn trỏ tới màn hình nhập mật khẩu mới ở giao diện FRONTEND
    const resetPasswordUrl = `${config.app.frontendHost || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    try {
      await MailService.sendEmail({
        to: user.email,
        subject: '[Fotobook] Reset Your Password',
        html: MailTemplates.getResetPasswordEmail({
          firstName: user.firstName,
          resetPasswordUrl,
        }),
      });
    } catch (mailError) {
      logError(
        'AuthService',
        `Failed to send reset password email to ${user.email}: ${mailError}`
      );
      throw new AppError(
        500,
        'Could not send reset password email. Please try again later.'
      );
    }

    return { message: 'Password reset link has been sent to your email.' };
  },

  // 🔒 2. Thực hiện đổi mật khẩu bằng token hợp lệ (Reset Password)
  resetPassword: async (token: string, passwordRaw: string) => {
    try {
      // Xác thực token
      const decoded = jwt.verify(
        token,
        config.jwt.resetPasswordSecret || 'your_reset_secret'
      ) as {
        userId: number;
      };

      // Băm mật khẩu mới
      const hashedPassword = await bcrypt.hash(passwordRaw, 10);

      // Cập nhật vào DB
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { passwordHash: hashedPassword },
      });

      return {
        message: 'Password has been successfully reset. You can now log in with your new password.',
      };
    } catch (_error) {
      throw new AppError(400, 'Reset token is invalid or has expired.');
    }
  },
};
