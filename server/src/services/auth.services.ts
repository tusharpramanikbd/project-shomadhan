import bcrypt from 'bcryptjs';
import redisClient from '../lib/redis.ts';
import prisma from '../lib/prisma.ts';
import { sendEmail } from './email.services.ts';
import 'dotenv/config';
import { generateToken } from '../utils/jwt.utils.ts';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from 'src/errors/index.ts';
import {
  TLoginResponse,
  TRegisterPayload,
  TRegisterResponse,
  TResendOtpResponse,
  TVerifyOtpResponse,
} from 'src/types/auth.types.ts';
import {
  OTP_EXPIRY_SECONDS,
  TOKEN_EXPIRY,
} from 'src/constants/auth.constants.ts';
import {
  checkCooldown,
  generateOtp,
  setCooldown,
} from 'src/utils/auth.utils.ts';
import { TJwtPayload } from 'src/types/jwt.types.ts';
import { MessageCodes } from 'src/constants/messageCodes.constants.ts';

export const registerUser = async (
  data: TRegisterPayload
): Promise<TRegisterResponse> => {
  const {
    firstName,
    lastName,
    email,
    password,
    division,
    district,
    upazila,
    address,
  } = data;

  // Checking existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });

  // Case 1: verified user exists → cannot register
  if (existingUser && existingUser.isVerified) {
    throw new ConflictError(
      MessageCodes.AUTH_EMAIL_ALREADY_REGISTERED_VERIFIED,
      'Email is already registered and verified.'
    );
  }

  // Case 2: unverified user exists → resend OTP (bypass cooldown)
  if (existingUser && !existingUser.isVerified) {
    await resendOtp(email, { bypassCooldown: true });
    return {
      status: 'pending_verification',
      email,
    };
  }

  // Hashing password
  const passwordHash = await bcrypt.hash(password, 10);

  // Createing user (isVerified = false)
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      divisionId: division?.id,
      divisionName: division?.name,
      divisionBnName: division?.bnName,
      districtId: district?.id,
      districtName: district?.name,
      districtBnName: district?.bnName,
      upazilaId: upazila?.id,
      upazilaName: upazila?.name,
      upazilaBnName: upazila?.bnName,
      address,
      isVerified: false,
    },
  });

  // Sending OTP
  await sendOtp(email);

  return {
    status: 'user_created',
    email: user.email,
  };
};

export const verifyOtp = async (
  email: string,
  providedOtp: string
): Promise<TVerifyOtpResponse> => {
  if (!email || !providedOtp) {
    throw new BadRequestError(
      MessageCodes.VALIDATION_EMAIL_OTP_REQUIRED,
      'Email and OTP are required.'
    );
  }

  const otpKey = `otp:email:${email}`;
  const cooldownKey = `otp:cooldown:${email}`;

  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) {
    throw new UnauthorizedError(
      MessageCodes.OTP_EXPIRED_OR_INVALID,
      'The OTP has expired or is invalid. Please request a new one.'
    );
  }

  if (storedOtp !== providedOtp) {
    // TODO: Implement attempt counting here to prevent brute-force attacks
    throw new UnauthorizedError(
      MessageCodes.OTP_INCORRECT,
      'The OTP you entered is incorrect.'
    );
  }

  // Clean up Redis
  await redisClient.del(otpKey);
  await redisClient.del(cooldownKey);

  // Validate user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new NotFoundError(
      MessageCodes.AUTH_USER_NOT_FOUND,
      'User not found for this email.'
    );
  }

  await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  const verificationPayload: TJwtPayload = {
    userId: user.userId,
    email: user.email,
    isVerified: true,
    purpose: 'auth',
  };

  const token = generateToken(verificationPayload, TOKEN_EXPIRY);

  const userData = {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    division: user.divisionName,
    district: user.districtName,
    upazila: user.upazilaName,
    isVerified: true,
  };

  console.log(
    `OTP for ${email} verified successfully. Registration token issued.`
  );
  return { token, userData };
};

export const resendOtp = async (
  email: string,
  options?: { bypassCooldown?: boolean }
): Promise<TResendOtpResponse> => {
  const bypassCooldown = options?.bypassCooldown ?? false;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new BadRequestError(
      MessageCodes.VALIDATION_EMAIL_INVALID,
      'Please provide a valid email address.'
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new NotFoundError(
      MessageCodes.AUTH_USER_NOT_FOUND,
      'User not found for this email.'
    );
  }

  if (user.isVerified) {
    throw new ConflictError(
      MessageCodes.AUTH_EMAIL_ALREADY_VERIFIED,
      'This email is already verified. Please log in.'
    );
  }

  // Checking cooldown only when NOT bypassing
  if (!bypassCooldown) {
    const cooldownCheck = await checkCooldown(email);

    if (cooldownCheck.blocked) {
      return {
        blocked: true,
        code: MessageCodes.OTP_RESEND_COOLDOWN_ACTIVE,
        message: 'Please wait before requesting another verification code.',
        cooldownUntil: cooldownCheck.cooldownUntil,
      };
    }
  }

  const otp = generateOtp();
  const otpKey = `otp:email:${email}`;

  await redisClient.set(otpKey, otp, { EX: OTP_EXPIRY_SECONDS });

  console.log(`New OTP ${otp} generated + stored for ${email}`);

  // Sending OTP email
  await sendEmail({
    to: email,
    subject: 'Your Project Shomadhan Verification Code (Resent)',
    text: `Your new verification code is: ${otp}`,
    html: `<p>Your new verification code is: <strong>${otp}</strong></p>`,
  });

  // Setting cooldown ONLY IF not bypassing
  const cooldownUntil = bypassCooldown ? undefined : await setCooldown(email);

  return {
    blocked: false,
    code: MessageCodes.OTP_RESENT_SUCCESS,
    message: 'A new verification code has been sent to your email.',
    cooldownUntil,
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<TLoginResponse> => {
  if (!email || !/\S+@\S+\.\S+/.test(email) || !password) {
    throw new BadRequestError(
      MessageCodes.VALIDATION_EMAIL_PASSWORD_REQUIRED,
      'Email and password are required.'
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new UnauthorizedError(
      MessageCodes.VALIDATION_EMAIL_PASSWORD_INVALID,
      'Invalid email or password.'
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError(
      MessageCodes.VALIDATION_EMAIL_PASSWORD_INVALID,
      'Invalid email or password.'
    );
  }

  // User exists but not verified
  if (!user.isVerified) {
    await resendOtp(email, { bypassCooldown: true });

    return {
      status: 'pending_verification',
      email,
    };
  }

  const payload: TJwtPayload = {
    userId: user.userId,
    email: user.email,
    isVerified: true,
    purpose: 'auth',
  };

  const token = generateToken(payload, TOKEN_EXPIRY);

  return {
    status: 'logged_in',
    token,
    userData: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      division: user.divisionName,
      district: user.districtName,
      upazila: user.upazilaName,
    },
  };
};

const sendOtp = async (email: string): Promise<void> => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new BadRequestError(
      MessageCodes.VALIDATION_EMAIL_INVALID,
      'Please provide a valid email address.'
    );
  }

  const otp = generateOtp();
  const redisKey = `otp:email:${email}`;

  try {
    const result = await redisClient.set(redisKey, otp, {
      EX: OTP_EXPIRY_SECONDS,
    });
    if (result !== 'OK') {
      console.warn(
        `Redis SET command for OTP did not return 'OK' for key ${redisKey}. Result: ${result}`
      );
    }
    console.log(
      `OTP ${otp} stored/updated in Redis for ${email} with key ${redisKey}`
    );
  } catch (error) {
    console.error('Redis error while storing OTP:', error);

    throw new InternalServerError(
      MessageCodes.REDIS_OTP_STORAGE_FAILED,
      'Failed to store verification code. Please try again later.'
    );
  }

  const emailSubject = 'Your Project Shomadhan Verification Code';
  const emailText = `Your verification code for Project Shomadhan is: ${otp}\nThis code will expire in ${OTP_EXPIRY_SECONDS / 60} minutes.`;
  const emailHtml = `<p>Your verification code for Project Shomadhan is: <strong>${otp}</strong></p><p>This code will expire in ${OTP_EXPIRY_SECONDS / 60} minutes.</p>`;

  await sendEmail({
    to: email,
    subject: emailSubject,
    text: emailText,
    html: emailHtml,
  });

  console.log(`OTP email sent to ${email}`);
};
