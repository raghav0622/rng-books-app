'use client';
import { CompanyFYSchema, UserSchema } from '@/schema';
import { useCreateResource } from '@/utils';

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
