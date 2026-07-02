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
      const { accessToken, refreshToken, user } = await authService.register(
        req.body
      );
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: { accessToken, user },
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
        status: 'success',
        message: 'Logged in successfully',
        data: { accessToken, user },
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
        status: 'success',
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
        status: 'success',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        status: 'success',
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
