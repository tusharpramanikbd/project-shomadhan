import {
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from 'src/constants/auth.constants.ts';
import crypto from 'crypto';
import redisClient from 'src/lib/redis.ts';

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
