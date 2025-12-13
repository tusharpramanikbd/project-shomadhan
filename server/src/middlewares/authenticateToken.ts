import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.ts';
import { TJwtPayload } from 'src/types/jwt.types.ts';

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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Getting token part after "Bearer "

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    // Token is invalid (expired, malformed, signature mismatch)
    return res
      .status(403)
      .json({ message: 'Access denied. Invalid or expired token.' });
  }

  req.user = decodedUser;

  next();
};
