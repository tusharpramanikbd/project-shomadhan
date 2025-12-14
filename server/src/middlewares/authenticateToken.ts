import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.ts';
import { TJwtPayload } from 'src/types/jwt.types.ts';
import { ForbiddenError, UnauthorizedError } from 'src/errors/index.ts';
import { MessageCodes } from 'src/constants/messageCodes.constants.ts';

// Extend the Express Request interface to include the 'user' property
// This allows us to attach the decoded JWT payload to the request object
// for use in subsequent route handlers.
declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError(
      MessageCodes.AUTH_TOKEN_MISSING,
      'Access token is missing.'
    );
  }

  const token = authHeader.split(' ')[1] as string;

  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    throw new ForbiddenError(
      MessageCodes.AUTH_TOKEN_INVALID,
      'Invalid or expired access token.'
    );
  }

  req.user = decodedUser;
  next();
};
