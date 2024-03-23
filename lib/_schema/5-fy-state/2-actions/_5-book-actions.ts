// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { FormError } from '@rng-apps/forms';
// import { v4 } from 'uuid';
// import { Book, CreateBook } from '../../1-schema';
// import { useBookState, useFYState } from '../1-atoms';
// import { useFYActions } from './2-fy-actions';
// import { useTransactionActions } from './_4-transaction-actions';

// export const useBookActions = () => {
//   const { fy } = useFYState();

//   const { addBookState, deleteBookState, updateBookState, getBookState } =
//     useBookState();

//   const { fyAction } = useFYActions();

//   const { removeTransaction } = useTransactionActions();

//   const createBook = (payload: CreateBook) => {
//     const isBookNameExisting = fy.books.filter(
//       (book) =>
//         book.name.trim().toLowerCase() === payload.name.trim().toLowerCase()
//     ).length;

//     if (isBookNameExisting > 0)
//       throw new FormError('Book Name must be unique', 'name');

//     const id = v4();
//     const {
//       bankDetail,
//       isSelfAccount,
//       name,
//       parentGroup,
//       accountNumber,
//       bankName,
//       description,
//       ifscCode,
//     } = payload;

//     const book: Book = {
//       balance: 0,
//       bankDetail: !!bankDetail,
//       editable: true,
//       id,
//       isSelfAccount: !!isSelfAccount,
//       lastTransactionDate: null,
//       locked: false,
//       name: name,
//       parentGroup: parentGroup.id,
//       recordType: 'Book',
//       transactionCount: 0,
//       transactions: [],
//       type: parentGroup.type,
//       accountNumber,
//       bankName,
//       description: description || null,
//       ifscCode,
//     };
//     addBookState(book);

//     fyAction();

//     return book;
//   };

//   const updateBookMeta = (id: string, next: Partial<Book>) => {
//     updateBookState(id, (prev) => ({ ...prev, ...next }));
//     fyAction();
//   };

//   const deleteBook = (id: string) => {
//     const book = getBookState(id);
//     if (!book) return;

//     book.transactions.forEach((transaction) => {
//       removeTransaction(transaction.id, true);
//     });

//     deleteBookState(id);
//     fyAction();
//   };

//   return {
//     createBook,
//     updateBookMeta,
//     deleteBook,
//   };
// };
