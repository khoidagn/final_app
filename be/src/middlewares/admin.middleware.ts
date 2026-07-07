import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware.js';
import { logError } from '../utils/logging.js';
import { Role } from '@prisma/client';
export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    logError(
      'AdminMiddleware',
      'Unauthorized access attempt - No user session found'
    );
    return next(new AppError(401, 'Unauthorized. Please login first.'));
  }

  if (user.role !== Role.ADMIN) {
    logError(
      'AdminMiddleware',
      `Forbidden access attempt - User ID: ${user.id} with role: ${user.role}`
    );
    return next(new AppError(403, 'Forbidden. Admin privileges required.'));
  }

  next();
};
