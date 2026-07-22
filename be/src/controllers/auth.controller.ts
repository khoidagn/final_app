import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { AppError } from '../middlewares/error.middleware.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  register: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { user } = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message:
          'Registration successful. Please check your email to verify your account.',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.query.token as string;
      if (!token) {
        throw new AppError(400, 'Verification token is required.');
      }

      const result = await authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  resendVerification: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new AppError(400, 'Email address is required.');
      }

      const result = await authService.resendVerification(email);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  checkStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const email = req.query.email as string;
      if (!email) {
        throw new AppError(400, 'Email parameter is required.');
      }

      const result = await authService.checkVerificationStatus(email);
      res.status(200).json({
        success: true,
        message: 'Verification status checked successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { accessToken, refreshToken, user } = await authService.login(
        req.body
      );

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          accessToken,
          refreshToken,
          user: { id: user.id, email: user.email, role: user.role },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.clearCookie('refreshToken', { ...COOKIE_OPTIONS, maxAge: 0 });
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  refresh: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tokenFromCookie = req.cookies.refreshToken;
      if (!tokenFromCookie) {
        throw new AppError(401, 'Refresh token not found');
      }

      const { accessToken } = await authService.refreshSession(tokenFromCookie);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        message: 'Current user profile retrieved successfully',
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) throw new AppError(400, 'Email is required.');

      const result = await authService.forgotPassword(email);
      res.status(200).json({
        success: true,
        message: 'Password reset link dispatched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        throw new AppError(400, 'Token and new password are required.');
      }

      const result = await authService.resetPassword(token, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
