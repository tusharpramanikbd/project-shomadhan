import { NextFunction, Request, Response } from 'express';
import * as AuthService from '../services/auth.services.ts';
import { ApiError } from 'src/errors/ApiError.ts';
import { BadRequestError } from 'src/errors/index.ts';
import { MessageCodes } from 'src/constants/messageCodes.constants.ts';

export const handleRegisterUser = async (
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
        code: MessageCodes.AUTH_REGISTER_SUCCESS,
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
        code: MessageCodes.AUTH_EMAIL_ALREADY_REGISTERED_UNVERIFIED,
        message:
          'This email is already registered but not verified. A new OTP has been sent to your inbox.',
        data: { email },
      });
      return;
    }

    // Should not normally happen
    next(
      new ApiError(
        500,
        MessageCodes.AUTH_UNEXPECTED_REGISTRATION_STATE,
        'Unexpected registration state.'
      )
    );
  } catch (error) {
    // Handled by global error handler
    next(error);
  }
};

export const handleVerifyOtp = async (
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
      throw new BadRequestError(
        MessageCodes.VALIDATION_EMAIL_PASSWORD_INVALID,
        'Email and OTP must be valid strings.'
      );
    }

    const { token, userData } = await AuthService.verifyOtp(email, otp);

    res.status(200).json({
      success: true,
      code: MessageCodes.OTP_VERIFIED_SUCCESS,
      message: 'OTP verified successfully.',
      token,
      data: userData,
    });
  } catch (error) {
    // Handled by global error handler
    next(error);
  }
};

export const handleResendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      throw new BadRequestError(
        MessageCodes.VALIDATION_EMAIL_INVALID,
        'A valid email address is required.'
      );
    }

    const { blocked, code, message, cooldownUntil } =
      await AuthService.resendOtp(email);

    // Cooldown active (not an error)
    if (blocked) {
      res.status(200).json({
        success: false,
        code,
        message,
        cooldownUntil,
      });
      return;
    }

    // OTP sent successfully
    res.status(200).json({
      success: true,
      code,
      message,
      cooldownUntil,
    });
  } catch (error) {
    next(error);
  }
};

export const handleLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError(
        MessageCodes.VALIDATION_EMAIL_PASSWORD_REQUIRED,
        'Email and password are required.'
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new BadRequestError(
        MessageCodes.VALIDATION_EMAIL_PASSWORD_INVALID,
        'Email and password must be valid strings.'
      );
    }

    const result = await AuthService.loginUser(email, password);

    if (result.status === 'pending_verification') {
      res.status(403).json({
        success: false,
        code: MessageCodes.AUTH_EMAIL_NOT_VERIFIED,
        message:
          'Your email is not verified. Please complete verification to continue.',
        data: { email: result.email },
      });
      return;
    }

    res.status(200).json({
      success: true,
      code: MessageCodes.AUTH_LOGIN_SUCCESS,
      message: 'Login successful.',
      token: result.token,
      data: result.userData,
    });
  } catch (error) {
    next(error);
  }
};
