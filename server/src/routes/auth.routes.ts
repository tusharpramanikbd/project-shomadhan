import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

// POST /api/register
router.post('/register', AuthController.registerUser);

// POST /api/otp/verify
router.post('/otp/verify', AuthController.handleVerifyOtp);

export default router;
