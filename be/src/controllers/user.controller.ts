import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { userService } from '../services/user.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const userController = {
  getMyProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) throw new AppError(401, 'Authentication required.');
      const currentUser = req.user as { id: number };

      const profile = await userService.getUserProfile(currentUser.id);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  },
  getUserProfileById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const targetUserId = parseInt(req.params.id as string, 10);
      if (isNaN(targetUserId)) throw new AppError(400, 'Invalid user ID.');

      const profile = await userService.getUserProfile(targetUserId);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  },
  updateMyProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as { id: number; role: Role };
      const updatedUser = await userService.updateProfile(
        user.id,
        user.id,
        user.role,
        req.body
      );

      res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error) {
      next(error);
    }
  },
  deleteMyAccount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as { id: number; role: Role };
      await userService.deleteAccount(user.id, user.id, user.role);

      res.status(200).json({
        status: 'success',
        message: 'Your account has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
  getFollowers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) throw new AppError(401, 'Authentication required.');
      const user = req.user as { id: number; role: Role };

      const targetUserId = req.params.id
        ? parseInt(req.params.id as string, 10)
        : user.id;

      if (isNaN(targetUserId)) {
        throw new AppError(400, 'Invalid user ID.');
      }

      const page = parseInt(req.query.page as string, 10) || 1;
      const data = await userService.getFollowers(targetUserId, page);

      res.status(200).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  },
  getFollowing: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const targetUserId = parseInt(req.params.id || (req.user as any)?.id, 10);
      const page = parseInt(req.query.page as string, 10) || 1;

      if (isNaN(targetUserId)) throw new AppError(400, 'Invalid user ID.');

      const data = await userService.getFollowing(targetUserId, page);
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  },
};
