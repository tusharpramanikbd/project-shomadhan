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

// Infer TypeScript type from schema
export type RegisterInput = z.infer<typeof registerSchema>;
