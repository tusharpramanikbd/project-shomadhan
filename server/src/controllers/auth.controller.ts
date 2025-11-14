import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service.ts';

/**
 * Handles the request to register a user with isVerified false.
 * Verification to be done via OTP later.
 * Expects full user details in the request body.
 */
const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with OTP.',
      data: { email: user.email },
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown registration error',
    });
  }
};

/**
 * Handles the request to verify an OTP for email verification.
 * Expects 'email' and 'otp' in the request body.
 */
const handleVerifyOtp = async (
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

    const { token, userData } = await AuthService.verifyOtp(email, otp);

    res.status(200).json({
      message: 'OTP verified successfully. Please complete your registration.',
      token,
      user: userData,
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

export { registerUser, handleVerifyOtp };
