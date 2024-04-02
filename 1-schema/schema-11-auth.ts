'use client';
import { email, string } from '@/utils';
import { z } from 'zod';

export const UserSignInSchema = z.object({
  email: email,
  password: string,
});

export type UserSignIn = z.infer<typeof UserSignInSchema>;

export const UserSignUpSchema = z.object({
  name: string,
  email: email,
  password: string.min(6),
});

export type UserSignUp = z.infer<typeof UserSignUpSchema>;
