import { CompanyFYSchema, UserSchema } from '@/schema';
import { useCreateResource } from '@rng-apps/forms';

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
