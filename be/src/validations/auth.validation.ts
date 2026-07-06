import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(25, 'First name must not exceed 25 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(25, 'Last name must not exceed 25 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address format')
      .max(255, 'Email must not exceed 255 characters'),
    password: z
      .string()
      .min(6, 'Password must contain at least 6 characters')
      .max(50, 'Password must not exceed 50 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});
