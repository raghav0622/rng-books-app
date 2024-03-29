import { boolean, email, optionalString, string } from '@rng-apps/forms';
import z from 'zod';
import { CompanySchema } from './schema-10-company';

export const UserSchema = z.object({
  id: string,
  name: string,
  email: email,
  emailVerified: boolean,
  photoUrl: optionalString,
  companies: z.array(CompanySchema),
  autoCompleteKeys: z.array(
    z.object({
      key: string,
      value: z.array(string),
    })
  ),
});

export type User = z.infer<typeof UserSchema>;
