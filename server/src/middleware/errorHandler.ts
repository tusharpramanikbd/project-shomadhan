import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../errors/ApiError.ts';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Known operational error (ApiError)
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unknown unhandled errors → 500
  console.error('Unhandled Error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
