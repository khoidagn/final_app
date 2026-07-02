import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AppError } from './error.middleware.js';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: any) => {
    if (err) return next(err);
    if (!user) {
      return next(
        new AppError(
          401,
          'Access token is invalid or expired. Please login again.'
        )
      );
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }
    const userRole = (req.user as any).role;
    if (!allowedRoles.includes(userRole)) {
      return next(
        new AppError(
          403,
          'Forbidden: You do not have permission to perform this action'
        )
      );
    }
    next();
  };
};
