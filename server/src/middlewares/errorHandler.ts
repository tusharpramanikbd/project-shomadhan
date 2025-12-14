import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../errors/ApiError.ts';
import { MessageCodes } from 'src/constants/messageCodes.constants.ts';

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
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Unknown unhandled errors → 500
  console.error('Unhandled Error:', err);

  res.status(500).json({
    success: false,
    code: MessageCodes.SYSTEM_INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  });
};
