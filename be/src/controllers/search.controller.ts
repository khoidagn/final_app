import { Request, Response, NextFunction } from 'express';
import { searchService } from '../services/search.service.js';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().catch(''),
});

export const searchController = {
  globalSearch: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedQuery = searchSchema.parse(req.query);
      const currentUserId = (req as any).user?.id;
      const currentUserRole = (req as any).user?.role;
      const searchResults = await searchService.searchPhotosAndAlbums(
        parsedQuery.q,
        currentUserId,
        currentUserRole
      );

      res.status(200).json({
        success: true,
        message: 'Search operations executed successfully.',
        data: searchResults,
      });
    } catch (error) {
      next(error);
    }
  },
};
