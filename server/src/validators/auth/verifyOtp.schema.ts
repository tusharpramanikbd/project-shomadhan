import { z } from 'zod';

export const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().min(6).max(6),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
