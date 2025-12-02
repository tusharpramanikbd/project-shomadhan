import { NextFunction, Request, Response } from 'express';
import * as AuthService from '../services/auth.service.ts';
import { ApiError } from 'src/errors/ApiError.ts';
import { BadRequestError } from 'src/errors/index.ts';

const handleRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, email } = await AuthService.registerUser(req.body);

    if (status === 'user_created') {
      // New user created
      res.status(201).json({
        success: true,
        message:
          'Registration successful! Please verify your account using the OTP sent to your email.',
        data: { email },
      });
      return;
    }

    if (status === 'pending_verification') {
      // User already existed but is unverified
      res.status(200).json({
        success: true,
        message:
          'This email is already registered but not verified. A new OTP has been sent to your inbox.',
        data: { email },
      });
      return;
    }

    // Should not normally happen
    next(new ApiError(500, 'Unexpected registration state.'));
  } catch (error) {
    // Handled by global error handler
    next(error);
  }
};

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
      throw new BadRequestError('Email and OTP must be valid strings.');
    }

    const { token, userData } = await AuthService.verifyOtp(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      token,
      data: userData,
    });
  } catch (error) {
    // Handled by global error handler
    next(error);
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

    const { message, cooldownUntil } = await AuthService.resendOtp(email);

    res.status(200).json({
      success: true,
      message,
      cooldownUntil,
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
        success: false,
        message: 'Email and password are required.',
      });
      return;
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Email and password must be valid strings.',
      });
      return;
    }

    const result = await AuthService.loginUser(email, password);

    if (result.status === 'pending_verification') {
      res.status(401).json({
        success: false,
        message:
          'Login pending verification. Please verify your email with OTP.',
        data: { email: result.email },
      });
      return;
    }

    if (result.status === 'logged_in') {
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        token: result.token,
        data: result.userData,
      });
      return;
    }

    // If control reaches here → service returned something unexpected
    res.status(500).json({
      success: false,
      message: 'Unexpected login state.',
    });
  } catch (error) {
    console.error('Login failed:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

export {
  handleRegisterUser,
  handleVerifyOtp,
  handleResendOtp,
  handleLoginUser,
};
