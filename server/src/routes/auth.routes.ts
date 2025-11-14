import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', AuthController.registerUser);

// POST /api/auth/otp/verify
router.post('/otp/verify', AuthController.handleVerifyOtp);

// POST /api/auth/otp/resend
router.post('/otp/resend', AuthController.handleResendOtp);

export default router;
