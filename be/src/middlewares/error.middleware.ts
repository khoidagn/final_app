import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logError, logInfo } from '../utils/logging.js';

const MODULE_NAME = 'ErrorMiddleware';

/**
 * Custom operational error class to capture explicit application exceptions.
 * Extends the native JavaScript Error object for precise control over HTTP statuses.
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError.
   *
   * @param {number} statusCode - The HTTP status code corresponding to the explicit error.
   * @param {string} message - Human-readable explanation of the error context.
   */
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Centralized Express error-handling middleware.
 * Intercepts all processing failures, handles custom exceptions, handles Zod schemas,
 * logs anomalous errors, and structuralizes error envelopes securely.
 *
 * @param {Error} err - The unhandled error intercepted during the request lifecycle.
 * @param {Request} req - The Express Request context object.
 * @param {Response} res - The Express Response context object.
 * @param {NextFunction} _next - Express next middleware function reference (unused).
 * @returns {void}
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Handle Zod Schema Validation Faults
  if (err instanceof ZodError) {
    logInfo(
      MODULE_NAME,
      `Validation error triggered on route: ${req.method} ${req.path}`
    );
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  // 2. Handle Explicitly Managed Application Operational Exceptions (AppError)
  if (err instanceof AppError) {
    logInfo(
      MODULE_NAME,
      `Operational error [${err.statusCode}]: ${err.message} at ${req.path}`
    );
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // 3. Handle JsonWebToken Signature Exceptions
  if (err.name === 'JsonWebTokenError') {
    logInfo(
      MODULE_NAME,
      `JWT verification breakdown intercepted: ${err.message}`
    );
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
    return;
  }

  // 4. Handle JsonWebToken Expiration Lifespan Threshold Exceptions
  if (err.name === 'TokenExpiredError') {
    logInfo(MODULE_NAME, `JWT lifetime expiration threshold triggered.`);
    res.status(401).json({
      success: false,
      error: 'Token has expired',
    });
    return;
  }

  // 5. Handle Unknown, Fatal or Systemic Internal Failures
  logError(
    MODULE_NAME,
    `Unexpected internal server error on route [${req.method} ${req.path}]: ${err.stack || err.message}`
  );

  res.status(500).json({
    success: false,
    error:
      'An unexpected internal server error occurred, please try again later!',
  });
};
