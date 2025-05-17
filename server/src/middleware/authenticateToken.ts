import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.utils.js';

// Extend the Express Request interface to include the 'user' property
// This allows us to attach the decoded JWT payload to the request object
// for use in subsequent route handlers.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Express middleware to authenticate requests using a JWT.
 * It checks for a token in the 'Authorization' header (Bearer scheme).
 * If the token is valid, it attaches the decoded payload to `req.user`.
 * If the token is missing or invalid, it sends a 401 or 403 response.
 */
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
