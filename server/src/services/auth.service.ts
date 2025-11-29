import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import redisClient from '../lib/redis.ts';
import prisma from '../lib/prisma.ts';
import { sendEmail } from './email.service.ts';
import 'dotenv/config';
import { generateToken, JwtPayload } from '../utils/jwt.utils.js';

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  division?: { id?: string; name?: string; bnName?: string };
  district?: { id?: string; name?: string; bnName?: string };
  upazila?: { id?: string; name?: string; bnName?: string };
  address?: string;
};

type VerifyOtpRes = {
  token: string;
  userData: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    division: string | null;
    district: string | null;
    upazila: string | null;
    isVerified: boolean;
  };
};

type RegisterResult =
  | { status: 'created'; email: string }
  | { status: 'pending_verification'; email: string };

type LoginResult =
  | { status: 'pending_verification'; email: string }
  | { status: 'logged_in'; token: string; userData: any };

type ResendOtpResult = {
  message: string;
  cooldownUntil: number;
};

const OTP_EXPIRY_SECONDS = 10 * 60;
const OTP_LENGTH = 6;
const TOKEN_EXPIRY = 30 * 60; // 30 minutes
const RESEND_COOLDOWN_SECONDS = 120;

const registerUser = async (data: RegisterPayload): Promise<RegisterResult> => {
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

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new Error('Email is already registered.');
    }

    // User exists but not verified → resend OTP
    await resendOtp(email);
    return {
      status: 'pending_verification',
      email: data.email,
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
    status: 'created',
    email: user.email,
  };
};

const verifyOtp = async (
  email: string,
  providedOtp: string
): Promise<VerifyOtpRes> => {
  if (!email || !providedOtp) {
    throw new Error('Email and OTP are required.');
  }

  const otpKey = `otp:email:${email}`;
  const cooldownKey = `otp:cooldown:${email}`;

  try {
    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp) {
      throw new Error('OTP expired or not found. Please request a new one.');
    }

    if (storedOtp !== providedOtp) {
      // TODO: Implement attempt counting here to prevent brute-force attacks
      throw new Error('Invalid OTP provided.');
    }

    await redisClient.del(otpKey);
    await redisClient.del(cooldownKey);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found.');
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    const verificationPayload: JwtPayload = {
      userId: user.userId,
      email: email,
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
  } catch (error) {
    console.error('Error verifying OTP:', error);
    if (
      error instanceof Error &&
      (error.message.includes('Invalid OTP') ||
        error.message.includes('OTP expired'))
    ) {
      throw error;
    }
    throw new Error(
      `Failed to verify OTP. ${error instanceof Error ? error.message : 'Internal server error'}`
    );
  }
};

const resendOtp = async (email: string): Promise<ResendOtpResult> => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new Error('Invalid email format provided.');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found.');
  }

  if (user.isVerified) {
    throw new Error('This email is already verified. Please log in.');
  }

  const cooldownKey = `otp:cooldown:${email}`;
  const cooldownUntilStr = await redisClient.get(cooldownKey);

  // If cooldown exists, returning remaining time
  if (cooldownUntilStr) {
    const cooldownUntil = parseInt(cooldownUntilStr, 10);
    const now = Date.now();

    // If cooldown is still active
    if (now < cooldownUntil) {
      return {
        message: 'Please wait before requesting another OTP.',
        cooldownUntil,
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

  // Calculating and storing cooldown timestamp
  const now = Date.now();
  const cooldownUntil = now + RESEND_COOLDOWN_SECONDS * 1000;

  await redisClient.set(cooldownKey, cooldownUntil.toString(), {
    EX: RESEND_COOLDOWN_SECONDS,
  });

  return {
    message: 'A new OTP has been sent to your email.',
    cooldownUntil,
  };
};

const loginUser = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  if (!email || !/\S+@\S+\.\S+/.test(email) || !password) {
    throw new Error('Invalid email or password');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  if (!user.isVerified) {
    await resendOtp(email);
    return {
      status: 'pending_verification',
      email: email,
    };
  }

  const payload = {
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

// Helper functions
const generateOtp = (): string => {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;

  try {
    const randomNumber = crypto.randomInt(min, max + 1);
    return randomNumber.toString().padStart(OTP_LENGTH, '0');
  } catch (error) {
    console.warn(
      'crypto.randomInt not available, using less secure Math.random() for OTP generation. Consider Node.js update.'
    );
    let otp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }
};

const sendOtp = async (email: string): Promise<void> => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new Error('Invalid email format provided.');
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
  } catch (error) {
    console.error(
      'Error in sendOtpForEmailVerification processing (Redis or Email):',
      error
    );

    throw new Error(
      `Failed to send OTP. ${error instanceof Error ? error.message : 'Internal server error'}`
    );
  }
};

export { registerUser, verifyOtp, resendOtp, loginUser };
