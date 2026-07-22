import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AppError } from './error.middleware.js';
import { logError, logInfo, logWarning } from '../utils/logging.js';
import { Role } from '@prisma/client';

const MODULE_NAME = 'AuthMiddleware';

/**
 * Middleware to enforce authentication using JWT access tokens.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction to pass control to the next handler.
 * @returns {void}
 *
 * @throws {AppError} 401 - If token is invalid/expired and route requires strict authentication.
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logInfo(MODULE_NAME, `Authenticating request path: ${req.path}`);

  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: any) => {
      if (err !== null && err !== undefined) {
        logError(
          MODULE_NAME,
          `Passport authentication strategy error: ${err.message}`
        );
        return next(err);
      }

      if (user === false || user === null || user === undefined) {
        logWarning(
          MODULE_NAME,
          `Unauthenticated request attempt at path: ${req.path}`
        );
        req.user = { id: null, role: Role.USER };
        const isPublicRoute =
          req.path.includes('/discovery_photos') ||
          req.path.includes('/discovery_albums') ||
          req.path.includes('/search');
        if (isPublicRoute === false) {
          logWarning(
            MODULE_NAME,
            `Strict authentication failure at non-public route: ${req.path}`
          );
          return next(
            new AppError(
              401,
              'Access token is invalid or expired. Please login again.'
            )
          );
        }
        logInfo(
          MODULE_NAME,
          `Guest identity bypassed for public resource path: ${req.path}`
        );
      } else {
        req.user = user;
        logInfo(
          MODULE_NAME,
          `User authenticated successfully. User ID: ${user.id}`
        );
      }
      next();
    }
  )(req, res, next);
};

/**
 * Soft authentication middleware that parses user contexts without blocking requests.
 * Used for endpoints accessible by both Guests and authenticated Users (e.g., Global Search).
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction to pass control to the next handler.
 * @returns {void}
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logInfo(
    MODULE_NAME,
    `Executing optional authentication parsing for path: ${req.path}`
  );

  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: any) => {
      if (err !== null && err !== undefined) {
        logError(
          MODULE_NAME,
          `Optional Passport authentication strategy error: ${err.message}`
        );
        return next(err);
      }
      if (user === false || user === null || user === undefined) {
        logInfo(
          MODULE_NAME,
          'No token context found. Initializing profile as Guest user.'
        );
        req.user = { id: null, role: Role.USER };
      } else {
        logInfo(
          MODULE_NAME,
          `Optional token parsing matched authenticated User ID: ${user.id}`
        );
        req.user = user;
      }
      next();
    }
  )(req, res, next);
};

/**
 * Role-Based Access Control (RBAC) middleware factory to authorize specific application roles.
 * Enforces permissions checks on the server level.
 * @param {...string[]} allowedRoles - Variadic list of permissible roles strings matching @prisma/client Roles.
 * @returns {(req: Request, _res: Response, next: NextFunction) => void} Curried Express middleware function.
 *
 * @throws {AppError} 401 - If req.user is uninitialized or missing.
 * @throws {AppError} 403 - If the user's role does not match the allowed system roles.
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (user === undefined || user === null || (user as any).id === null) {
      logWarning(
        MODULE_NAME,
        `Role authorization rejected - Requesting client is unauthenticated.`
      );
      return next(new AppError(401, 'Authentication required'));
    }
    const userRole = (user as any).role;
    if (allowedRoles.includes(userRole) === false) {
      logError(
        MODULE_NAME,
        `Role authorization violation - User ID: ${(user as any).id} with role: ${userRole} denied access.`
      );
      return next(
        new AppError(
          403,
          'Forbidden: You do not have permission to perform this action'
        )
      );
    }
    logInfo(
      MODULE_NAME,
      `Access authorized for User ID: ${(user as any).id} with role: ${userRole}.`
    );
    next();
  };
};
