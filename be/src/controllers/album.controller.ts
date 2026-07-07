import { Request, Response, NextFunction } from 'express';
import { albumService } from '../services/album.service.js';

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
      const result = await albumService.getMyAlbums(userId, page, limit);
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
  deleteAlbum: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      const userId = (req as any).user?.id;

      await albumService.deleteAlbum(albumId, userId);

      res.status(200).json({
        message: 'Album deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
