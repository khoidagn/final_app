import { Request, Response, NextFunction } from 'express';
import { albumService } from '../services/album.service.js';
import { AppError } from '../middlewares/error.middleware.js';
import { Role } from '@prisma/client';
import { logInfo } from '../utils/logging.js';

const MODULE_NAME = 'AlbumController';

export const albumController = {
  createAlbum: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const { title, description, sharingMode } = req.body;
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        throw new AppError(
          400,
          'Please upload at least one image for the album.'
        );
      }
      const files = req.files as Express.Multer.File[];
      const imageUrls = files.map((file) => file.path || (file as any).url);
      const album = await albumService.createAlbum({
        title,
        description,
        userId,
        sharingMode,
        imageUrls,
      });

      res.status(201).json({
        success: true,
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
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const userReq = req.user as any;
      const currentUserId = userReq?.id || undefined;

      const result = await albumService.getDiscoveryAlbums(
        page,
        limit,
        currentUserId
      );

      res.status(200).json({
        success: true,
        message: 'Discovery albums retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getFeedsAlbums: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as any).id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await albumService.getFeedsAlbums(userId, page, limit);

      res.status(200).json({
        success: true,
        message: 'Feed albums retrieved successfully',
        data: result,
      });
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

      res.status(200).json({
        success: true,
        message: 'My albums retrieved successfully',
        data: result,
      });
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

      res.status(200).json({
        success: true,
        message: 'User albums retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getAlbumById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      const userReq = req.user as any;
      const currentUserId = userReq?.id || undefined;
      const currentUserRole = userReq?.role || undefined;
      const album = await albumService.getAlbumById(
        albumId,
        currentUserId,
        currentUserRole
      );

      res.status(200).json({
        success: true,
        message: 'Album details retrieved successfully',
        data: album,
      });
    } catch (error) {
      next(error);
    }
  },

  updateAlbum: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      const userId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;

      const { title, description, sharingMode, remainingImages } = req.body;

      logInfo(
        MODULE_NAME,
        `Request to update album ${albumId} by user ${userId}`
      );

      let remainingImageIds: number[] = [];
      if (remainingImages) {
        if (Array.isArray(remainingImages)) {
          remainingImageIds = remainingImages
            .map((id: any) => parseInt(id, 10))
            .filter((id: number) => !isNaN(id));
        } else if (typeof remainingImages === 'string') {
          try {
            const parsedIds = JSON.parse(remainingImages);
            if (Array.isArray(parsedIds)) {
              remainingImageIds = parsedIds
                .map((id: any) => Number(id))
                .filter((id: number) => !isNaN(id));
            }
          } catch {
            remainingImageIds = remainingImages
              .split(',')
              .map((id: string) => parseInt(id.trim(), 10))
              .filter((id: number) => !isNaN(id));
          }
        }
      }

      logInfo(
        MODULE_NAME,
        `Remaining image IDs parsed: [${remainingImageIds.join(', ')}]`
      );

      let newImageUrls: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        newImageUrls = req.files.map((file: any) => file.path || file.url);
        logInfo(
          MODULE_NAME,
          `Received ${newImageUrls.length} new image files to upload.`
        );
      }

      const updated = await albumService.updateAlbum(
        albumId,
        userId,
        currentUserRole,
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
        message: 'Album updated successfully',
        data: updated,
      });
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
        success: true,
        message: 'Album deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
};
