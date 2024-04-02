'use client';

import { boolean, date, number, optionalString, string } from '@/utils';
import z from 'zod';
import { BookTransactionSchema } from './schema-01-transaction';

export const BookOrGroupTypeSchema = z.enum(['Account', 'Ledger']);

export type BookOrGroupType = z.infer<typeof BookOrGroupTypeSchema>;

export const BookOrGroupCategorySchema = z.enum([
  'Bank Account',
  'Fixed Deposit',
  'Fixed Asset',
  'Ledger',
  'Balance Sheet',
]);

export type BookOrGroupCategory = z.infer<typeof BookOrGroupTypeSchema>;

export const BookBaseSchema = z.object({
  recordType: z.literal('Book'),
  type: BookOrGroupTypeSchema,
  category: BookOrGroupCategorySchema,
  parentGroup: string,
  parentGroupName: string,
  id: string,
  name: string,
  description: optionalString,
  editable: boolean,
  locked: boolean,
  lastTransactionDate: z.nullable(date),
  transactionCount: number,
  balance: number,

  transactions: z.array(BookTransactionSchema),

  isSelfBook: boolean,
  isBankAccount: boolean,
  bankName: optionalString,
  accountNumber: optionalString,
  ifscCode: optionalString,
});

export const BookLedgerSchema = BookBaseSchema.extend({
  isSelfBook: z.literal(false),
  isBankAccount: z.literal(false),
  bankName: z.literal(null),
  accountNumber: z.literal(null),
  ifscCode: z.literal(null),
  type: BookOrGroupTypeSchema.extract(['Ledger']),
  category: BookOrGroupCategorySchema.extract(['Ledger']),
});

export const BookBankAccountSchema = BookBaseSchema.extend({
  type: BookOrGroupTypeSchema.exclude(['Ledger']),
  category: BookOrGroupCategorySchema.exclude(['Ledger']),
  isSelfBook: z.literal(true),
  isBankAccount: z.literal(true),
  bankName: string,
  accountNumber: string,
  ifscCode: string,
});

export const BookSchema =
  BookBankAccountSchema.or(BookLedgerSchema).or(BookBaseSchema);

export type BookLedger = z.infer<typeof BookLedgerSchema>;
export type BookBankAccount = z.infer<typeof BookBankAccountSchema>;
export type Book = z.infer<typeof BookSchema>;
export type BookBase = z.infer<typeof BookBaseSchema>;
