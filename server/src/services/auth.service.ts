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

const OTP_EXPIRY_SECONDS = 10 * 60;
const OTP_LENGTH = 6;
const OTP_VERIFICATION_TOKEN_EXPIRY = 15 * 60; // 15 minutes

/**
 * Handles the logic for registering a user.
 * - Checks if the email is already registered.
 * - Generates password hash.
 * - Stores user in the db.
 * - Sends the OTP via email request.
 */
const registerUser = async (data: RegisterPayload) => {
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
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email is already registered.');
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

  return user;
};

/**
 * Generates a cryptographically secure random OTP.
 * @returns A string representing the OTP.
 */
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

/**
 * Handles the logic for sending an OTP to a user's email for verification.
 * - Checks if the email is already registered.
 * - Generates an OTP.
 * - Stores the OTP in Redis with an expiry.
 * - Sends the OTP via email.
 * @param email - The email address to send the OTP to.
 * @returns Promise<void>
 * @throws Error if email is already registered or if sending OTP fails.
 */
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

/**
 * Verifies the OTP provided by the user against the one stored in Redis.
 * If successful, generates a short-lived token to authorize full registration.
 * @param email - The user's email address.
 * @param providedOtp - The OTP string provided by the user.
 * @returns Promise<{ verificationToken: string }>
 * @throws Error if OTP is invalid, expired, or if there's a Redis error.
 */
const verifyOtp = async (
  email: string,
  providedOtp: string
): Promise<{ verificationToken: string }> => {
  if (!email || !providedOtp) {
    throw new Error('Email and OTP are required.');
  }

  const redisKey = `otp:email:${email}`;

  try {
    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp) {
      throw new Error('OTP expired or not found. Please request a new one.');
    }

    if (storedOtp !== providedOtp) {
      // TODO: Implement attempt counting here to prevent brute-force attacks
      throw new Error('Invalid OTP provided.');
    }

    await redisClient.del(redisKey);

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

    const verificationToken = generateToken(
      verificationPayload,
      OTP_VERIFICATION_TOKEN_EXPIRY
    );

    console.log(
      `OTP for ${email} verified successfully. Registration token issued.`
    );
    return { verificationToken };
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

export { registerUser, sendOtp, verifyOtp };
