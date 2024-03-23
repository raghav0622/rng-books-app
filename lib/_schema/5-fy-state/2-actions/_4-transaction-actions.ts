// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { v4 } from 'uuid';
// import {
//   CreateTransaction,
//   Transaction,
//   TransactionCarryEntry,
//   UpdateTransaction,
// } from '../../1-schema';
// import { useBookState, useFYMetaState, useTransactionState } from '../1-atoms';
// import { useFYActions } from './2-fy-actions';
// import { useBookTransactionActions } from './3-book-transaction-actions';

// export const useTransactionActions = () => {
//   const { value: fy } = useFYMetaState();
//   const { getBookState } = useBookState();
//   const {
//     addTransactionInBook,
//     removeTransactionInBook,
//     updateTransactionInBook,
//   } = useBookTransactionActions();

//   const {
//     addTransactionState,
//     deleteTransactionState,
//     updateTransactionState,
//     getTransactionState,
//   } = useTransactionState();

//   const { fyAction } = useFYActions();

//   const addCarryTransaction = (book_id: string, balance: number) => {
//     const transaction: Transaction = {
//       date: new Date(fy.startYear, 3, 1),
//       description: `By Balance B/F from FY${fy.startYear - 1}-${fy.startYear}`,
//       amount: balance,
//       primaryBook: book_id,
//       id: v4(),
//       transactionType: 'carry-entry',
//       contra: null,
//       secondaryBook: null,
//     };

//     addTransactionInBook(book_id, transaction);

//     addTransactionState(transaction);

//     fyAction();
//   };

//   const addSimpleTransaction = (payload: CreateTransaction) => {
//     const { primaryBook: pId, secondaryBook: sId } = payload;

//     const primaryBook = getBookState(pId);
//     const secondaryBook = getBookState(sId);

//     if (!primaryBook || !secondaryBook) return;

//     const isSelfEntry = primaryBook.isSelfBook && secondaryBook.isSelfBook;

//     const isLedgerEntry =
//       primaryBook.type !== 'Ledger' && secondaryBook.type === 'Ledger';

//     if (isLedgerEntry) {
//       const transaction: Transaction = {
//         amount: payload.amount,
//         date: payload.date,
//         id: v4(),
//         primaryBook: primaryBook.id,
//         transactionType: 'leger-entry',
//         contra: null,
//         description: payload.description,
//         secondaryBook: secondaryBook.id,
//       };

//       addTransactionInBook(pId, transaction);
//       addTransactionInBook(sId, transaction);

//       addTransactionState(transaction);
//     } else {
//       const id = v4();
//       const contraId = v4();

//       const transaction: Transaction = {
//         amount: payload.amount,
//         date: payload.date,
//         id,
//         primaryBook: primaryBook.id,
//         secondaryBook: secondaryBook.id,
//         transactionType: isSelfEntry
//           ? 'self-to-self-entry'
//           : 'self-to-other-entry',
//         contra: contraId,
//         description: payload.description,
//       };

//       const contraTransaction: Transaction = {
//         amount: -payload.amount,
//         date: payload.date,
//         id: contraId,
//         primaryBook: secondaryBook.id,
//         secondaryBook: primaryBook.id,
//         transactionType: isSelfEntry
//           ? 'self-to-self-entry'
//           : 'self-to-other-entry',
//         contra: id,
//         description: payload.description,
//       };

//       addTransactionInBook(pId, transaction);
//       addTransactionInBook(sId, contraTransaction);

//       addTransactionState(transaction);
//       addTransactionState(contraTransaction);
//     }

//     fyAction();
//   };

//   const updateTransaction = (
//     previous: Transaction,
//     payload: UpdateTransaction
//   ) => {
//     if (!payload.secondaryBook) return;
//     if (
//       previous.secondaryBook !== payload.secondaryBook ||
//       previous.primaryBook !== payload.primaryBook
//     ) {
//       removeTransaction(previous.id, true);
//       addSimpleTransaction(payload);
//     } else {
//       const primaryBook = getBookState(payload.primaryBook);
//       const secondaryBook = getBookState(payload.secondaryBook);

//       if (!primaryBook || !secondaryBook) return;
//       const isLedgerEntry =
//         primaryBook.type !== 'Ledger' && secondaryBook.type === 'Ledger';

//       const update: Transaction = {
//         ...previous,
//         ...payload,
//       };
//       if (isLedgerEntry) {
//         updateTransactionInBook(payload.primaryBook, update);
//         updateTransactionInBook(payload.secondaryBook, update);
//       } else {
//         if (update.contra && update.secondaryBook) {
//           const updatedContraTransaction: Transaction = {
//             ...update,
//             id: update.contra,
//             contra: update.id,
//             primaryBook: update.secondaryBook,
//             secondaryBook: update.primaryBook,
//             amount: -update.amount,
//           };
//           updateTransactionInBook(payload.primaryBook, update);
//           updateTransactionInBook(
//             updatedContraTransaction.primaryBook,
//             updatedContraTransaction
//           );
//           updateTransactionState(
//             updatedContraTransaction.id,
//             () => updatedContraTransaction
//           );
//         }
//       }

//       updateTransactionState(update.id, () => update);
//     }
//     fyAction();
//   };

//   const removeTransaction = (id: string, notFyAction?: boolean) => {
//     const payload = getTransactionState(id);

//     if (!payload) return;

//     if (payload.transactionType === 'carry-entry') {
//       removeTransactionInBook(payload.primaryBook, payload.id);
//       deleteTransactionState(payload.id);
//     } else {
//       removeTransactionInBook(payload.primaryBook, payload.id);
//       deleteTransactionState(payload.id);

//       if (payload.secondaryBook) {
//         if (payload.transactionType === 'leger-entry') {
//           removeTransactionInBook(payload.secondaryBook, payload.id);
//         } else {
//           if (payload.contra) {
//             removeTransactionInBook(payload.secondaryBook, payload.contra);
//             deleteTransactionState(payload.contra);
//           }
//         }
//       }
//     }
//     if (!notFyAction) {
//       fyAction();
//     }
//   };

//   const updateCarryTransaction = (
//     prev: TransactionCarryEntry,
//     payload: Partial<TransactionCarryEntry>
//   ) => {
//     const primaryBook = getBookState(prev.primaryBook);

//     if (!primaryBook) return;

//     const update: TransactionCarryEntry = {
//       ...prev,
//       ...payload,
//     };

//     updateTransactionState(prev.id, () => update);
//     updateTransactionInBook(prev.primaryBook, update);
//     fyAction();
//   };

//   return {
//     addSimpleTransaction,
//     addCarryTransaction,
//     removeTransaction,
//     updateCarryTransaction,
//     updateTransaction,
//   };
// };
