'use client';
import { string } from '@/utils';
import z from 'zod';
import { CompanyFYMetaSchema } from './schema-04-fy';

export const CompanySchema = z.object({
  id: string,
  name: string.max(20),
  fy: z.array(CompanyFYMetaSchema),
});

export type Company = z.infer<typeof CompanySchema>;

export const CreateCompanySchema = CompanySchema.pick({
  userId: true,
  name: true,
});

export type CreateCompany = z.infer<typeof CreateCompanySchema>;
