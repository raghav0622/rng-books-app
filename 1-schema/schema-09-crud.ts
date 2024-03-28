import { numberNegative, numberPositive, string } from '@rng-apps/forms';
import z from 'zod';
import { TransactionBaseSchema } from './schema-01-transaction';
import {
  BookBankAccountSchema,
  BookBaseSchema,
  BookLedgerSchema,
} from './schema-02-book';
import { GroupSchema } from './schema-03-group';
import { CompanyFYSchema } from './schema-04-fy';

// export const UpdateCarryTransactionSchema = TransactionSchema.omit({
//   contra: true,
//   id: true,
//   secondaryBook: true,
//   primaryBook: true,

//   transactionType: true,
// });

// export type UpdateCarryTransaction = z.infer<
//   typeof UpdateCarryTransactionSchema
// >;

// export const UpdateTransactionSchema = TransactionSchema.omit({
//   contra: true,
//   id: true,

//   transactionType: true,
// }).extend({ secondaryBook: string });

// export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;

// export const CreateBookSchema = BookSchema.omit({
//   editable: true,
//   id: true,
//   lastTransactionDate: true,
//   recordType: true,
//   transactions: true,
//   transactionCount: true,
//   locked: true,
//   type: true,
//   parentGroup: true,
//   isSelfAccount: true,
//   bankDetail: true,
// })
//   .partial({ balance: true })
//   .extend({
//     parentGroup: GroupSchema,
//     isSelfAccount: booleanInput,
//     bankDetail: booleanInput,
//   })
//   .superRefine((payload, ctx) => {
//     if (payload.bankDetail) {
//       if (!payload.accountNumber) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Account number required',
//           path: ['accountNumber'],
//         });
//       }
//       if (!payload.bankName) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Bank Name required',
//           path: ['bankName'],
//         });
//       }
//       if (!payload.ifscCode) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'IFSC Code required',
//           path: ['ifscCode'],
//         });
//       }
//     }

//     if (!payload.parentGroup) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Group required',
//         path: ['group'],
//       });
//     }
//   });

// export type CreateBook = z.infer<typeof CreateBookSchema>;

// export const UpdateBookMetaSchema = BookSchema.omit({
//   editable: true,
//   lastTransactionDate: true,
//   transactions: true,
//   recordType: true,
//   transactionCount: true,
//   balance: true,
//   id: true,
//   locked: true,
//   type: true,
// })
//   .extend({
//     isSelfAccount: booleanInput,
//     bankDetail: booleanInput,
//     parentGroup: GroupSchema,
//   })
//   .superRefine((payload, ctx) => {
//     if (payload.bankDetail) {
//       if (!payload.accountNumber) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Account number required',
//           path: ['accountNumber'],
//         });
//       }
//       if (!payload.bankName) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'Bank Name required',
//           path: ['bankName'],
//         });
//       }
//       if (!payload.ifscCode) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'IFSC Code required',
//           path: ['ifscCode'],
//         });
//       }
//     }
//   });

// export type UpdateBookMeta = z.infer<typeof CreateBookSchema>;

export const InitiateFYSchema = CompanyFYSchema.pick({
  startYear: true,
}).extend({ cashInHand: numberPositive, capitalBackForward: numberNegative });

export type InitiateFY = z.infer<typeof InitiateFYSchema>;

export const CreateLedgerBookSchema = BookLedgerSchema.omit({
  accountNumber: true,
  balance: true,
  bankName: true,
  category: true,
  type: true,
  editable: true,
  id: true,
  ifscCode: true,
  isBankAccount: true,
  isSelfBook: true,
  lastTransactionDate: true,
  locked: true,
  parentGroupName: true,
  recordType: true,
  transactionCount: true,
  transactions: true,
}).extend({
  parentGroup: GroupSchema,
});

export type CreateLedgerBook = z.infer<typeof CreateLedgerBookSchema>;

export const CreateBankAccountSchema = BookBankAccountSchema.pick({
  parentGroup: true,
  accountNumber: true,
  balance: true,
  bankName: true,
  description: true,
  ifscCode: true,
  name: true,
}).extend({
  parentGroup: GroupSchema,
});

export type CreateBankAccount = z.infer<typeof CreateBankAccountSchema>;

export const CreateGeneralAccountSchema = BookBaseSchema.pick({
  description: true,
  balance: true,
  accountNumber: true,
  bankName: true,
  ifscCode: true,
  isBankAccount: true,
  isSelfBook: true,
  name: true,
})
  .extend({
    parentGroup: GroupSchema,
  })
  .superRefine((payload, ctx) => {
    if (payload.isBankAccount) {
      if (!payload.accountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account number required',
          path: ['accountNumber'],
        });
      }
      if (!payload.bankName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bank Name required',
          path: ['bankName'],
        });
      }
      if (!payload.ifscCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IFSC Code required',
          path: ['ifscCode'],
        });
      }
    }
  });

export type CreateGeneralAccount = z.infer<typeof CreateGeneralAccountSchema>;

export const CreateGroupSchema = GroupSchema.pick({
  name: true,
  balanceCRLabel: true,
  balanceDRLabel: true,
  description: true,
  exploded: true,
}).extend({
  parentGroup: GroupSchema,
});

export type CreateGroup = z.infer<typeof CreateGroupSchema>;

export const CreateTransactionSchema = TransactionBaseSchema.omit({
  contra: true,
  id: true,
  transactionType: true,
})
  .extend({
    primaryBook: string,
    secondaryBook: string,
  })
  .superRefine((payload, ctx) => {
    if (payload.amount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter amount of transaction',
        path: ['amount'],
      });
    }
  });

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
