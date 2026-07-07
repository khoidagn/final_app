import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logError } from '../utils/logging.js';
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  //Handle Zod Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  //Handle Custom Operational Errors (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  //Handle JWT Security Errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      message: 'Token has expired',
    });
    return;
  }

  //Handle Unknown Internal Server Errors (500)
  logError(
    'ErrorMiddleware',
    'Unexpected internal server error: ' + err.message
  );
  res.status(500).json({
    status: 'error',
    message:
      'An unexpected internal server error occurred, please try again later!',
  });
};
