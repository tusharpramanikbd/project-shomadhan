import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service.ts';

const handleSendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Email is required and must be a string.',
      });
      return;
    }

    await AuthService.sendOtpForEmailVerification(email);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully. Please check your email.',
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Email address is already registered.') {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }

      console.error('Error in handleSendOtp controller:', error.message);
      res.status(500).json({
        success: false,
        message:
          error.message || 'Failed to send OTP due to an internal error.',
      });
      return;
    } else {
      console.error('Unknown error in handleSendOtp controller:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred.',
      });
    }
  }
};

export { handleSendOtp };
