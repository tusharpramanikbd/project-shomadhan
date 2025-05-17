import { sign, verify } from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
}

export interface JwtPayload {
  userId: number;
  name: string;
}

/**
 * Generates a JSON Web Token.
 * @param payload - The data to include in the token (e.g., userId, name).
 * @param expiresIn - Token expiration time in seconds. Defaults to 3600 seconds (1 hour).
 * @returns The generated JWT string.
 */
export const generateToken = (
  payload: JwtPayload,
  expiresIn: number = 3600
): string => {
  return sign(payload, JWT_SECRET!, { algorithm: 'HS256', expiresIn });
};

/**
 * Verifies a JSON Web Token.
 * @param token - The JWT string to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = verify(token, JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error(
      'Invalid token:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
};
