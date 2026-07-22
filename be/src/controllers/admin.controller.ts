import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { userService } from '../services/user.service.js';
import { photoService } from '../services/photo.service.js';
import { albumService } from '../services/album.service.js';
import { Role } from '@prisma/client';
import { logError } from '../utils/logging.js';
import cloudinary from '../config/cloudinary.js';

const MODULE_NAME = 'AdminController';

export const adminController = {
  getPhotos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const data = await adminService.getAllPhotosMaster(page, limit);
      res.status(200).json({
        success: true,
        message: 'Photos retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  getAlbums: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const data = await adminService.getAllAlbumsMaster(page, limit);
      res.status(200).json({
        success: true,
        message: 'Albums retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  getUsers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await adminService.getAllUsersMaster(page, limit);
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const targetUserId = parseInt(req.params.id as string, 10);
      if (isNaN(targetUserId)) {
        throw new AppError(400, 'Invalid user ID.');
      }

      const userDetail = await adminService.getUserByIdMaster(targetUserId);

      res.status(200).json({
        success: true,
        message: 'User details retrieved successfully',
        data: userDetail,
      });
    } catch (error) {
      next(error);
    }
  },
  
  adminGetPhotoById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const photoId = parseInt(req.params.id as string, 10);
      if (isNaN(photoId)) throw new AppError(400, 'Invalid photo ID.');

      const admin = req.user as { id: number; role: Role };

      const photo = await photoService.getPhotoById(
        photoId,
        admin.id,
        admin.role
      );

      res.status(200).json({
        success: true,
        message: 'Photo details retrieved successfully by Admin',
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  },

  adminGetAlbumById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      if (isNaN(albumId)) throw new AppError(400, 'Invalid album ID.');

      const admin = req.user as { id: number; role: Role };

      const album = await albumService.getAlbumById(
        albumId,
        admin.id,
        admin.role
      );

      res.status(200).json({
        success: true,
        message: 'Album details retrieved successfully by Admin',
        data: album,
      });
    } catch (error) {
      next(error);
    }
  },

  patchUserStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUserId = parseInt(req.params.id as string, 10);
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: "Field 'isActive' must be a boolean value.",
        });
      }

      const updatedUser = await adminService.toggleUserStatus(
        targetUserId,
        isActive
      );
      res.status(200).json({
        success: true,
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
      const { firstName, lastName, email, password } = req.body;

      let avatarUrl: string | undefined = undefined;
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'avatars',
        });
        avatarUrl = uploadResult.secure_url;
      }

      const updatedUser = await userService.updateProfile(
        targetUserId,
        admin.id,
        admin.role,
        {
          firstName,
          lastName,
          email,
          password: password && password.trim() !== '' ? password : undefined,
          avatarUrl,
        }
      );

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully by Admin',
        data: updatedUser,
      });
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
        success: true,
        message: 'User account has been permanently removed by Admin.',
      });
    } catch (error) {
      next(error);
    }
  },

  adminUpdatePhoto: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photoId = parseInt(req.params.id as string, 10);
      const admin = req.user as { id: number; role: Role };

      const imageUrl = req.file
        ? (req.file as any).path || (req.file as any).url
        : undefined;

      const updated = await photoService.updatePhoto(
        photoId,
        admin.id,
        admin.role,
        {
          title: req.body.title,
          description: req.body.description,
          sharingMode: req.body.sharingMode,
          imageUrl,
        }
      );

      res.status(200).json({
        success: true,
        message: 'Photo updated by Admin successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  adminUpdateAlbum: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      const admin = req.user as { id: number; role: Role };

      const { title, description, sharingMode, remainingImages } = req.body;

      let remainingImageIds: number[] = [];
      if (remainingImages) {
        try {
          const parsedIds = JSON.parse(remainingImages);
          if (Array.isArray(parsedIds)) {
            remainingImageIds = parsedIds.map((id: any) => Number(id));
          }
        } catch (parseError: any) {
          logError(
            MODULE_NAME,
            `Error parsing remainingImages from form-data: ${parseError?.message || parseError}`
          );
          if (typeof remainingImages === 'string') {
            remainingImageIds = remainingImages
              .split(',')
              .map((id: string) => parseInt(id.trim(), 10))
              .filter(Boolean);
          }
        }
      }

      let newImageUrls: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        newImageUrls = req.files.map((file: any) => file.path || file.url);
      }

      const updated = await albumService.updateAlbum(
        albumId,
        admin.id,
        admin.role,
        {
          title,
          description,
          sharingMode,
          remainingImageIds,
          newImageUrls,
        }
      );

      res.status(200).json({
        success: true,
        message: 'Album updated by Admin successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};
