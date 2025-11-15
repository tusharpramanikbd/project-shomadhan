import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service.ts';

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, email } = await AuthService.registerUser(req.body);

    if (status === 'created') {
      // New user created
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email with OTP.',
        data: { email: email },
      });
      return;
    }

    if (status === 'pending_verification') {
      // User already existed but is unverified
      res.status(200).json({
        success: true,
        message: 'Email is already registered but not verified. OTP resent.',
        data: { email: email },
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Unexpected registration state.',
    });
  } catch (error) {
    console.error('Registration failed:', error);

    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

const handleVerifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (
      !email ||
      typeof email !== 'string' ||
      !otp ||
      typeof otp !== 'string'
    ) {
      res.status(400).json({
        success: false,
        message: 'Email and OTP are required and must be strings.',
      });
      return;
    }

    const { token, userData } = await AuthService.verifyOtp(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      token,
      data: userData,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('Invalid OTP') ||
        error.message.includes('OTP expired')
      ) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      console.error('Error in handleVerifyOtp controller:', error.message);
      res.status(500).json({
        success: false,
        message:
          error.message || 'Failed to verify OTP due to an internal error.',
      });
      return;
    }
    console.error('Unknown error in handleVerifyOtp controller:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'An unexpected error occurred while verifying OTP.',
      });
  }
};

const handleResendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Valid email is required.',
      });
      return;
    }

    const { message, cooldown } = await AuthService.resendOtp(email);

    res.status(200).json({
      success: true,
      message,
      cooldown,
    });
  } catch (error: any) {
    console.error('Error in handleResendOtp controller:', error);

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to resend OTP due to an internal error.',
    });
  }
};

const handleLoginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Email and password are required.',
      });
      return;
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({
        message: 'Email and password must be valid strings.',
      });
      return;
    }

    const result = await AuthService.loginUser(email, password);

    if (result.status === 'pending_verification') {
      res.status(401).json({
        message:
          'Login pending verification. Please verify your email with OTP.',
        data: { email: result.email },
      });
      return;
    }

    if (result.status === 'logged_in') {
      res.status(200).json({
        message: 'Login successful.',
        token: result.token,
        user: result.userData,
      });
      return;
    }

    // If control reaches here → service returned something unexpected
    res.status(500).json({
      message: 'Unexpected login state.',
    });
  } catch (error) {
    console.error('Login failed:', error);

    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

export { registerUser, handleVerifyOtp, handleResendOtp, handleLoginUser };
