import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service.js';

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
};
