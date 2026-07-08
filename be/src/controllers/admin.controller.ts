import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { userService } from '../services/user.service.js';
import { Role } from '@prisma/client';
export const adminController = {
  getPhotos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const data = await adminService.getAllPhotosMaster(page);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
  getAlbums: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const data = await adminService.getAllAlbumsMaster(page);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
  patchUserStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUserId = parseInt(req.params.id as string, 10);
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res
          .status(400)
          .json({ message: "Field 'isActive' must be a boolean value." });
      }

      const updatedUser = await adminService.toggleUserStatus(
        targetUserId,
        isActive
      );
      res.status(200).json({
        message: `User account has been successfully ${isActive ? 'activated' : 'suspended'}.`,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
  adminUpdateUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const targetUserId = parseInt(req.params.id as string, 10);
      if (isNaN(targetUserId)) throw new AppError(400, 'Invalid user ID.');

      const admin = req.user as { id: number; role: Role };
      const updatedUser = await userService.updateProfile(
        targetUserId,
        admin.id,
        admin.role,
        req.body
      );

      res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error) {
      next(error);
    }
  },
  adminDeleteUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const targetUserId = parseInt(req.params.id as string, 10);
      if (isNaN(targetUserId)) throw new AppError(400, 'Invalid user ID.');

      const admin = req.user as { id: number; role: Role };

      if (targetUserId === admin.id) {
        throw new AppError(
          400,
          'You cannot delete your own admin account via this endpoint.'
        );
      }

      await userService.deleteAccount(targetUserId, admin.id, admin.role);

      res.status(200).json({
        status: 'success',
        message: 'User account has been permanently removed by Admin.',
      });
    } catch (error) {
      next(error);
    }
  },
};
