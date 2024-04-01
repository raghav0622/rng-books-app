'use client';

import { date, number, optionalString, string } from '@/rng-forms';

import z from 'zod';

export const TransactionCategorySchema = z.enum([
  'carry-entry',
  'self-to-self-entry',
  'self-to-other-entry',
  'leger-entry',
]);

export type TransactionCategory = z.infer<typeof TransactionCategorySchema>;

export const TransactionBaseSchema = z.object({
  id: string,
  date: date,
  amount: number,
  description: optionalString,
  transactionType: TransactionCategorySchema,
  primaryBook: string,
  secondaryBook: optionalString,
  contra: optionalString,
});

export const TransactionCarryEntrySchema = TransactionBaseSchema.extend({
  transactionType: TransactionCategorySchema.extract(['carry-entry']),
  secondaryBook: z.literal(null),
  contra: z.literal(null),
});

export const TransactionLedgerEntrySchema = TransactionBaseSchema.extend({
  transactionType: TransactionCategorySchema.extract(['leger-entry']),
  secondaryBook: string,
  contra: z.literal(null),
});

export const TransactionAccountEntrySchema = TransactionBaseSchema.extend({
  transactionType: TransactionCategorySchema.exclude([
    'carry-entry',
    'leger-entry',
  ]),
  secondaryBook: string,
  contra: string,
});

export type TransactionCarryEntry = z.infer<typeof TransactionBaseSchema>;
export type TransactionLedgerEntry = z.infer<
  typeof TransactionLedgerEntrySchema
>;
export type TransactionAccountEntry = z.infer<
  typeof TransactionAccountEntrySchema
>;

export const TransactionSchema = TransactionAccountEntrySchema.or(
  TransactionLedgerEntrySchema
).or(TransactionCarryEntrySchema);

export type Transaction = z.infer<typeof TransactionSchema>;

export const BookTransactionData = z.object({
  prevBalance: number,
  nextBalance: number,
  serial: number,
});

export const BookTransactionSchema =
  TransactionBaseSchema.and(BookTransactionData);

export type BookTransaction = z.infer<typeof BookTransactionSchema>;
