import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { TJwtPayload } from 'src/types/jwt.type.ts';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
}

export const generateToken = (
  payload: TJwtPayload,
  expiresIn: number = 3600
): string => {
  return jwt.sign(payload, JWT_SECRET!, { algorithm: 'HS256', expiresIn });
};

export const verifyToken = (token: string): TJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as TJwtPayload;
    return decoded;
  } catch (error) {
    console.error(
      'Invalid token:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
};
