import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

// POST /api/auth/otp/send
router.post('/otp/send', AuthController.handleSendOtp);

// POST /api/auth/otp/verify
router.post('/otp/verify', AuthController.handleVerifyOtpForRegistration);

export default router;
