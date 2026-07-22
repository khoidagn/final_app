import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import { logInfo, logWarning } from '../utils/logging.js';

const MODULE_NAME = 'ValidateMiddleware';

/**
 * @param {ZodTypeAny} schema - The Zod validation schema configuration instance to process incoming requests against.
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<void>} Curried asynchronous Express middleware function.
 */
export const validate = (schema: ZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      logInfo(
        MODULE_NAME,
        `Request context successfully passed schema validation gates for path: ${req.path}`
      );
      next();
    } catch (error) {
      logWarning(
        MODULE_NAME,
        `Schema validation criteria violation encountered on route [${req.method} ${req.path}]. Transferring control to Centralized Error Middleware.`
      );
      next(error);
    }
  };
};
