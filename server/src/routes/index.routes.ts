import { Router, Request, Response, NextFunction } from 'express';
import { ServiceUnavailableError } from 'src/errors/index.ts';
import prisma from 'src/lib/prisma.ts';
import { MessageCodes } from 'src/constants/messageCodes.constants.ts';

const router = Router();

/**
 * Base route
 */
router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Project Shomadhan API!');
});

/**
 * Health check
 */
router.get(
  '/health',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        status: 'UP',
        code: MessageCodes.SYSTEM_DATABASE_CONNECTED,
        database: 'Database Connected',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(
        new ServiceUnavailableError(
          MessageCodes.SYSTEM_DATABASE_CONNECTION_FAILED,
          'Database connection failed'
        )
      );
    }
  }
);

export default router;
