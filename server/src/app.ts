import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import prisma from './lib/prisma.ts';
import './lib/redis.ts';
import './services/email.service.ts';
import authRoutes from './routes/auth.routes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Project Shomadhan API!');
});

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'UP',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({
      status: 'DOWN',
      database: 'Disconnected',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown database error',
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
