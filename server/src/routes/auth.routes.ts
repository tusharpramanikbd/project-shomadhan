import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

// POST /api/auth/otp/send
router.post('/otp/send', AuthController.handleSendOtp);

export default router;
