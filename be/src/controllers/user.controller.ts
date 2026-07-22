import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { userService } from '../services/user.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import cloudinary from '../config/cloudinary.js';

export const userController = {
  getMyProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) throw new AppError(401, 'Authentication required.');
      const currentUser = req.user as { id: number };

      const profile = await userService.getUserProfile(
        currentUser.id,
        currentUser.id
      );

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profile,
      });
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

      const userReq = req.user as any;
      const currentUserId = userReq && userReq.id ? userReq.id : undefined;

      const profile = await userService.getUserProfile(
        targetUserId,
        currentUserId
      );

      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const currentUserId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;
      const targetUserId = parseInt(req.params.userId || currentUserId, 10);

      const { firstName, lastName, email, oldPassword, password } = req.body;

      let avatarUrl: string | undefined = undefined;
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'avatars',
        });
        avatarUrl = uploadResult.secure_url;
      }

      const updatedUser = await userService.updateProfile(
        targetUserId,
        currentUserId,
        currentUserRole,
        {
          firstName,
          lastName,
          email,
          oldPassword,
          password: password && password.trim() !== '' ? password : undefined,
          avatarUrl,
        }
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
      });
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
        success: true,
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
      const userReq = req.user as any;
      const currentUserId =
        userReq && userReq.id !== null ? userReq.id : undefined;

      const targetUserId = req.params.id
        ? parseInt(req.params.id as string, 10)
        : currentUserId;

      if (!targetUserId || isNaN(targetUserId)) {
        throw new AppError(400, 'Invalid user ID or authentication required.');
      }

      const page = parseInt(req.query.page as string, 10) || 1;

      const data = await userService.getFollowers(
        targetUserId,
        currentUserId,
        page
      );

      res.status(200).json({
        success: true,
        message: 'Followers list retrieved successfully',
        data,
      });
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
      const userReq = req.user as any;
      const currentUserId =
        userReq && userReq.id !== null ? userReq.id : undefined;

      const targetUserId = req.params.id
        ? parseInt(req.params.id as string, 10)
        : currentUserId;

      if (!targetUserId || isNaN(targetUserId)) {
        throw new AppError(400, 'Invalid user ID or authentication required.');
      }

      const page = parseInt(req.query.page as string, 10) || 1;

      const data = await userService.getFollowing(
        targetUserId,
        currentUserId,
        page
      );

      res.status(200).json({
        success: true,
        message: 'Following list retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
