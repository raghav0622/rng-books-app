import { z } from 'zod';
import { TransactionDerivedSchema } from './schema-05-transaction-derived';
import { BookDerivedSchema } from './schema-06-book-derived';
import { GroupDerivedSchema } from './schema-07-group-derived';

export const FYDerivedSchema = z.object({
  transactions: z.array(TransactionDerivedSchema),
  transactionsSelf: z.array(TransactionDerivedSchema),
  transactionsLedger: z.array(TransactionDerivedSchema),
  transactionsCash: z.array(TransactionDerivedSchema),
  transactionsOther: z.array(TransactionDerivedSchema),
  books: z.array(BookDerivedSchema),
  groups: z.array(GroupDerivedSchema),
});

export type FYDerived = z.infer<typeof FYDerivedSchema>;
