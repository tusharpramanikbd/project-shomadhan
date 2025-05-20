import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service.ts';

/**
 * Handles the request to send an OTP for email verification.
 * Expects 'email' in the request body.
 */
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

/**
 * Handles the request to verify an OTP for email verification.
 * Expects 'email' and 'otp' in the request body.
 */
const handleVerifyOtpForRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (
      !email ||
      typeof email !== 'string' ||
      !otp ||
      typeof otp !== 'string'
    ) {
      res
        .status(400)
        .json({ message: 'Email and OTP are required and must be strings.' });
      return;
    }

    const { verificationToken } =
      await AuthService.verifyOtpAndIssueRegistrationToken(email, otp);

    res.status(200).json({
      message: 'OTP verified successfully. Please complete your registration.',
      verificationToken: verificationToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('Invalid OTP') ||
        error.message.includes('OTP expired')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error(
        'Error in handleVerifyOtpForRegistration controller:',
        error.message
      );
      res.status(500).json({
        message:
          error.message || 'Failed to verify OTP due to an internal error.',
      });
      return;
    }
    console.error(
      'Unknown error in handleVerifyOtpForRegistration controller:',
      error
    );
    res
      .status(500)
      .json({ message: 'An unexpected error occurred while verifying OTP.' });
  }
};

export { handleSendOtp, handleVerifyOtpForRegistration };
