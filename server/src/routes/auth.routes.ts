import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

// POST /api/register
router.post('/register', AuthController.registerUser);

// POST /api/otp/send
router.post('/otp/send', AuthController.handleSendOtp);

// POST /api/otp/verify
router.post('/otp/verify', AuthController.handleVerifyOtpForRegistration);

export default router;
