'use client';

import { boolean, number, string } from '@/rng-forms';
import z from 'zod';
import { TransactionSchema } from './schema-01-transaction';
import { BookSchema } from './schema-02-book';
import { GroupSchema } from './schema-03-group';

export const CompanyFYSchema = z.object({
  id: string,
  name: string,
  startYear: number,
  endYear: number,
  locked: boolean,
  version: number,
  companyId: string,
  userId: string,

  books: z.array(BookSchema),
  groups: z.array(GroupSchema),
  transactions: z.array(TransactionSchema),
});

export type CompanyFY = z.infer<typeof CompanyFYSchema>;

export const CompanyFYMetaSchema = CompanyFYSchema.pick({
  id: true,
  locked: true,
  name: true,
  startYear: true,
  endYear: true,
  companyId: true,
  userId: true,
});

export type CompanyFYMeta = z.infer<typeof CompanyFYMetaSchema>;
