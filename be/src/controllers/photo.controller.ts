import { Request, Response, NextFunction } from 'express';
import { photoService } from '../services/photo.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { Role } from '@prisma/client';

export const photoController = {
  uploadPhoto: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new AppError(400, 'Please upload an image file.');
      }
      const userId = (req.user as any).id;
      const { title, description, sharingMode } = req.body;
      const imageUrl = req.file.path;
      const newPhoto = await photoService.createPhoto({
        title,
        description,
        imageUrl,
        userId,
        sharingMode,
      });
      res.status(201).json({
        status: 'success',
        message: 'Photo uploaded successfully.',
        data: { photo: newPhoto },
      });
    } catch (error) {
      next(error);
    }
  },
  getFeedsPhotos: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as any).id;
      const page = parseInt(String(req.query.page), 10) || 1;
      const limit = parseInt(String(req.query.limit), 10) || 10;
      const result = await photoService.getFeedsPhotos(userId, page, limit);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  },
  getDiscoveryPhotos: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(String(req.query.page), 10) || 1;
      const limit = parseInt(String(req.query.limit), 10) || 10;
      const result = await photoService.getDiscoveryPhotos(page, limit);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  },
  getMyPhotos: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) throw new AppError(401, 'Authentication required.');
      const user = req.user as { id: number };
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const result = await photoService.getPhotosByUserId(
        user.id,
        user.id,
        page,
        limit
      );

      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  },
  getUserPhotos: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) throw new AppError(401, 'Authentication required.');
      const currentUser = req.user as { id: number };
      const targetUserId = parseInt(req.params.userId as string, 10);
      if (isNaN(targetUserId)) throw new AppError(400, 'Invalid user ID.');
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;

      const result = await photoService.getPhotosByUserId(
        targetUserId,
        currentUser.id,
        page,
        limit
      );

      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  },
  updatePhoto: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as any).id;
      const photoId = parseInt(String(req.params.id), 10);
      const { title, description, sharingMode } = req.body;
      await photoService.getPhotoAndVerifyOwner(photoId, userId);
      const imageUrl = req.file ? req.file.path : undefined;
      const updatedPhoto = await photoService.updatePhoto(photoId, {
        title,
        description,
        sharingMode,
        imageUrl,
      });

      res.status(200).json({
        status: 'success',
        message: 'Photo data updated successfully.',
        data: { photo: updatedPhoto },
      });
    } catch (error) {
      next(error);
    }
  },
  deletePhoto: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const photoId = parseInt(req.params.id as string, 10);
      if (isNaN(photoId)) {
        throw new AppError(400, 'Invalid photo ID.');
      }
      if (!req.user) {
        throw new AppError(401, 'Authentication required.');
      }

      const user = req.user as { id: number; role: Role };
      await photoService.deletePhoto(photoId, user.id, user.role);
      res.status(200).json({
        status: 'success',
        message: 'Photo deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
};
