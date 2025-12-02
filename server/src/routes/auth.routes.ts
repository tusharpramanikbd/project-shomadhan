import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

// ==============================
// Public Routes
// ==============================

// POST /api/auth/register
router.post('/register', AuthController.registerUser);

// POST /api/auth/otp/verify
router.post('/otp/verify', AuthController.handleVerifyOtp);

// POST /api/auth/otp/resend
router.post('/otp/resend', AuthController.handleResendOtp);

// POST /api/auth/login
router.post('/login', AuthController.handleLoginUser);

// ==============================
// Private Routes
// ==============================

export default router;
