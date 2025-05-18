import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import prisma from './lib/prisma.js';
import './lib/redis.js';
import './services/email.service.js';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

export default app;
