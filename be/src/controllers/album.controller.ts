import { Request, Response, NextFunction } from 'express';
import { albumService } from '../services/album.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { Role } from '@prisma/client';

export const albumController = {
  createAlbum: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const { title, description, sharingMode } = req.body;

      const files = req.files as Express.Multer.File[];
      const imageUrls = files?.map((file) => file.path) || [];

      const album = await albumService.createAlbum({
        title,
        description,
        userId,
        sharingMode,
        imageUrls,
      });

      res.status(201).json({
        message: 'Album created successfully',
        data: album,
      });
    } catch (error) {
      next(error);
    }
  },
  getDiscoveryAlbums: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await albumService.getDiscoveryAlbums(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getFeedsAlbums: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await albumService.getFeedsAlbums(userId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getMyAlbums: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await albumService.getAlbumsByUserId(
        userId,
        userId,
        page,
        limit
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getUserAlbums: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = (req as any).user?.id;
      const targetUserId = parseInt(req.params.userId as string, 10);

      if (isNaN(targetUserId)) {
        throw new AppError(400, 'Invalid user ID.');
      }

      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await albumService.getAlbumsByUserId(
        targetUserId,
        currentUserId,
        page,
        limit
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  updateAlbum: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      const userId = (req as any).user?.id;
      const { title, description, sharingMode } = req.body;

      const updated = await albumService.updateAlbum(albumId, userId, {
        title,
        description,
        sharingMode,
      });

      res
        .status(200)
        .json({ message: 'Album updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  },
  deleteAlbum: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      if (isNaN(albumId)) {
        throw new AppError(400, 'Invalid album ID.');
      }

      if (!req.user) {
        throw new AppError(401, 'Authentication required.');
      }
      const user = req.user as { id: number; role: Role };
      await albumService.deleteAlbum(albumId, user.id, user.role);

      res.status(200).json({
        status: 'success',
        message: 'Album deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
};
