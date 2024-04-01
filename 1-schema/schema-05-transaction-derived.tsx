'use client';

import { z } from 'zod';
import {
  BookTransactionData,
  TransactionAccountEntrySchema,
  TransactionCarryEntrySchema,
  TransactionLedgerEntrySchema,
  TransactionSchema,
} from './schema-01-transaction';
import { BookBaseSchema } from './schema-02-book';

export const TransactionDerivedCarryEntrySchema =
  TransactionCarryEntrySchema.extend({
    primaryBook: BookBaseSchema,
    secondaryBook: z.literal(null),
    contra: z.literal(null),
  });

export const TransactionDerivedLedgerEntrySchema =
  TransactionLedgerEntrySchema.extend({
    primaryBook: BookBaseSchema,
    secondaryBook: BookBaseSchema,
    contra: z.literal(null),
  });

export const TransactionDerivedAccountEntrySchema =
  TransactionAccountEntrySchema.extend({
    primaryBook: BookBaseSchema,
    secondaryBook: BookBaseSchema,
    contra: TransactionSchema,
  });

export const TransactionDerivedSchema = TransactionDerivedLedgerEntrySchema.or(
  TransactionDerivedAccountEntrySchema
).or(TransactionDerivedCarryEntrySchema);

export type TransactionDerived = z.infer<typeof TransactionDerivedSchema>;

export const BookTransactionDerivedSchema =
  TransactionDerivedSchema.and(BookTransactionData);

export type BookTransactionDerived = z.infer<
  typeof BookTransactionDerivedSchema
>;
