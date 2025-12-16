import express, { Express } from 'express';
import cors from 'cors';
import 'dotenv/config';
import './lib/redis.ts';
import './services/email.services.ts';
import indexRoutes from './routes/index.routes.ts';
import authRoutes from './routes/auth.routes.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
