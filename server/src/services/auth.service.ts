import crypto from 'crypto';
import redisClient from '../lib/redis.ts';
import prisma from '../lib/prisma.ts';
import { sendEmail } from './email.service.ts';
import 'dotenv/config';
import { generateToken, JwtPayload } from '../utils/jwt.utils.js';

const OTP_EXPIRY_SECONDS = 10 * 60;
const OTP_LENGTH = 6;
const OTP_VERIFICATION_TOKEN_EXPIRY = 15 * 60; // 15 minutes

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
const sendOtpForEmailVerification = async (email: string): Promise<void> => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new Error('Invalid email format provided.');
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email address is already registered.');
    }
  } catch (dbError) {
    console.error('Database error checking for existing user:', dbError);
    throw new Error('Could not verify email status due to a database error.');
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
const verifyOtpAndIssueRegistrationToken = async (
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

    const verificationPayload: Pick<JwtPayload, 'userId'> & {
      email: string;
      purpose: string;
    } = {
      userId: -1, // Placeholder, as user is not yet created.
      email: email,
      purpose: 'email_otp_verified_for_registration',
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

export { sendOtpForEmailVerification, verifyOtpAndIssueRegistrationToken };
