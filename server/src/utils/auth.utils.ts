import {
  OTP_EXPIRY_SECONDS,
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from 'src/constants/auth.constants.ts';
import crypto from 'crypto';
import redisClient from 'src/lib/redis.ts';
import { sendEmail } from 'src/services/email.services.ts';

export const generateOtp = (): string => {
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

export const sendOtp = async (email: string): Promise<void> => {
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

export const setCooldown = async (email: string): Promise<number> => {
  const cooldownKey = `otp:cooldown:${email}`;
  const cooldownUntil = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;

  await redisClient.set(cooldownKey, cooldownUntil.toString(), {
    EX: RESEND_COOLDOWN_SECONDS,
  });

  return cooldownUntil;
};

export const checkCooldown = async (
  email: string
): Promise<{ blocked: boolean; cooldownUntil?: number }> => {
  const cooldownUntil = await getCooldown(email);
  const now = Date.now();

  if (cooldownUntil && now < cooldownUntil) {
    return { blocked: true, cooldownUntil };
  }

  return { blocked: false };
};

const getCooldown = async (email: string): Promise<number | null> => {
  const cooldownKey = `otp:cooldown:${email}`;
  const cooldownUntilStr = await redisClient.get(cooldownKey);
  return cooldownUntilStr ? parseInt(cooldownUntilStr, 10) : null;
};
