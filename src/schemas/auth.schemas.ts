import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8).max(128, 'Too long').trim(),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1, 'Name required').max(100, 'Too long'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
