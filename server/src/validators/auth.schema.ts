import { z } from 'zod';

const passwordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
);

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8).regex(passwordRegex),
  division: z.object({
    id: z.string(),
    name: z.string(),
    bnName: z.string(),
  }),
  district: z.object({
    id: z.string(),
    name: z.string(),
    bnName: z.string(),
  }),
  upazila: z.object({
    id: z.string(),
    name: z.string(),
    bnName: z.string(),
  }),
  address: z.string().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().min(6).max(6),
});

export const resendOtpSchema = z.object({
  email: z.email(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
