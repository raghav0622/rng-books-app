'use client';

import { z } from 'zod';
import {
  BookBankAccountSchema,
  BookBaseSchema,
  BookLedgerSchema,
} from './schema-02-book';
import { GroupSchema } from './schema-03-group';

// const SummarySchema = z.object({
//   bookId: string,
//   bookName: string,
//   bookParentGroupName: string,
//   amount: number,
// });

export const BookDerivedLedgerSchema = BookLedgerSchema.extend({
  parentGroup: GroupSchema,
  // jama: z.array(SummarySchema),
  // kharch: z.array(SummarySchema),
  // dendar: z.array(SummarySchema),
  // lendar: z.array(SummarySchema),
  // selfentries: z.array(SummarySchema),
});

export const BookDerivedAccountSchema = BookBankAccountSchema.extend({
  parentGroup: GroupSchema,
  // jama: z.array(SummarySchema),
  // kharch: z.array(SummarySchema),
  // dendar: z.array(SummarySchema),
  // lendar: z.array(SummarySchema),
  // selfentries: z.array(SummarySchema),
});

export const BookDerivedGeneralAccountSchema = BookBaseSchema.extend({
  parentGroup: GroupSchema,
  // jama: z.array(SummarySchema),
  // kharch: z.array(SummarySchema),
  // dendar: z.array(SummarySchema),
  // lendar: z.array(SummarySchema),
  // selfentries: z.array(SummarySchema),
});

export const BookDerivedSchema = BookDerivedAccountSchema.or(
  BookDerivedGeneralAccountSchema
).or(BookDerivedLedgerSchema);

export type BookDerived = z.infer<typeof BookDerivedSchema>;

// const useBookSummary = (transactions: BookEntry[]) => {
//   const { getAccountState } = useAccountAPI();
//   const { getLedgerState } = useLedgerAPI();

//   const ledgerTransactionsGrouped = groupBy(
//     transactions.filter(
//       (i) =>
//         i.transacionCategory === "simple" &&
//         i.secondaryBookType === "ledger-book"
//     ),
//     "secondaryBook"
//   );

//   const accountTransactionsGrouped = groupBy(
//     transactions.filter(
//       (i) =>
//         i.transacionCategory === "simple" &&
//         i.secondaryBookType === "account-book"
//     ),
//     "secondaryBook"
//   );

//   const getBalance = (obj: Dictionary<BookEntry[]>) => {
//     return Object.keys(obj).map((i) => {
//       const balance = obj[i].reduce((partialSum, elem) => {
//         return elem.type === "CR"
//           ? partialSum + elem.amount
//           : partialSum - elem.amount;
//       }, 0);
//       const book = getAccountState(i) || getLedgerState(i);
//       return {
//         name: book.name,
//         balance: balance,
//         type: book.recordType,
//         id: book.id,
//         group: book.group,
//       };
//     });
//   };

//   return {
//     accounts: sortBy(
//       getBalance(accountTransactionsGrouped),
//       "balance"
//     ).reverse(),
//     ledgers: sortBy(getBalance(ledgerTransactionsGrouped), "balance").reverse(),
//   };
// };
