import { Request, Response, NextFunction } from 'express';
import { interactionService } from '../services/interaction.service.js';

export const interactionController = {
  likePhoto: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photoId = parseInt(req.params.id as string, 10);
      const userId = (req as any).user?.id;

      const result = await interactionService.toggleLike(
        photoId,
        'PHOTO',
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  likeAlbum: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albumId = parseInt(req.params.id as string, 10);
      const userId = (req as any).user?.id;

      const result = await interactionService.toggleLike(
        albumId,
        'ALBUM',
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  followUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUserId = parseInt(req.params.id as string, 10);
      const followerId = (req as any).user?.id;
      const result = await interactionService.toggleFollowUser(
        targetUserId,
        followerId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
