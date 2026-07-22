import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware.js';
import { logError, logInfo, logWarning } from '../utils/logging.js';
import { Role } from '@prisma/client';

const MODULE_NAME = 'AdminMiddleware';

/**
 * @param {Request} req - Express Request object containing authenticated user context decoded from JWT.
 * @param {Response} _res - Express Response object (unused).
 * @param {NextFunction} next - Express NextFunction to trigger the subsequent middleware or controller.
 *
 * @returns {void}
 *
 * @throws {AppError} 401 - If the user session or authentication token is missing.
 * @throws {AppError} 403 - If the authenticated user does not possess the ADMIN role.
 */
export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  logInfo(MODULE_NAME, 'Executing admin privilege verification checkpoint.');

  const user = (req as any).user;

  if (user === undefined || user === null) {
    logWarning(
      MODULE_NAME,
      'Unauthorized access attempt detected - No authenticated user context found in request.'
    );
    return next(new AppError(401, 'Unauthorized. Please login first.'));
  }

  if (user.role !== Role.ADMIN) {
    logError(
      MODULE_NAME,
      `Forbidden access violation - User ID: ${user.id} attempted to access admin routes with role: ${user.role}`
    );
    return next(new AppError(403, 'Forbidden. Admin privileges required.'));
  }

  logInfo(
    MODULE_NAME,
    `Admin identity successfully verified for User ID: ${user.id}. Access granted.`
  );

  next();
};
