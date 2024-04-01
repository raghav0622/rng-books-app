'use client';
import { useCreateResource } from '@/rng-forms';
import { CompanyFYSchema, UserSchema } from '@/schema';

export const useUserResource = () =>
  useCreateResource({
    name: 'user',
    schema: UserSchema,
  });

export const useFYResource = () =>
  useCreateResource({
    name: `fy-data`,
    schema: CompanyFYSchema,
  });
