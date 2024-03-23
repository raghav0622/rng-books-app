import { fireDate } from '@rng-apps/forms';
import dayjs from 'dayjs';
import { BookTransaction, Transaction } from '../../1-schema';
import { useBookState } from '../1-atoms';

export const useBookTransactionActions = () => {
  const { updateBookState, getBookState } = useBookState();

  const addTransactionInBook = (id: string, transaction: Transaction) => {
    const book = getBookState(id);
    if (!book) return;
    const { transactionCount, balance, transactions } = book;

    const lastTransaction = transactions[transactions.length - 1];
    const lastTransDate =
      lastTransaction !== undefined
        ? fireDate(lastTransaction.date)
        : undefined;
    const currentTransDate = transaction.date;

    if (
      (lastTransDate && dayjs(lastTransDate).isBefore(currentTransDate)) ||
      transactionCount === 0 ||
      dayjs(lastTransDate).isSame(currentTransDate)
    ) {
      const nextBalance = balance + transaction.amount;

      const newTransaction: BookTransaction = {
        ...transaction,
        nextBalance,
        serial: transactionCount + 1,
        prevBalance: balance,
      };

      const bookTransactions: BookTransaction[] = [
        ...transactions,
        newTransaction,
      ];

      updateBookState(book.id, (prev) => ({
        ...prev,
        transactions: bookTransactions,
      }));
    } else if (dayjs(lastTransDate).isAfter(currentTransDate)) {
      const prevTransactionCount = transactions.filter(
        (t) =>
          dayjs(fireDate(t.date)).isBefore(currentTransDate) ||
          dayjs(fireDate(t.date)).isSame(currentTransDate)
      ).length;

      const newTransaction = {
        ...transaction,
        nextBalance: 0,
        serial: prevTransactionCount + 1,
        prevBalance: 0,
      } as BookTransaction;

      const newTransactions = [...transactions];

      newTransactions.splice(prevTransactionCount, 0, newTransaction);

      updateBookState(book.id, (prev) => ({
        ...prev,
        transactions: newTransactions,
      }));
    }
  };

  const removeTransactionInBook = (id: string, transactionId: string) => {
    const book = getBookState(id);
    if (!book) return;

    const transIndex = book.transactions.findIndex(
      (t) => t.id === transactionId
    );

    if (transIndex > -1) {
      const newTransactions = [...book.transactions];

      newTransactions.splice(transIndex, 1);

      updateBookState(book.id, (prev) => ({
        ...prev,
        transactions: newTransactions,
      }));
    }
  };

  const updateTransactionInBook = (id: string, voucher: Transaction) => {
    const book = getBookState(id);
    if (!book) return;

    const bookTransactions = book.transactions;
    const bookTransactionIndex = bookTransactions.findIndex(
      (t) => t.id === voucher.id
    );
    const bookTransaction = book.transactions[bookTransactionIndex];

    if (dayjs(bookTransaction.date).isSame(fireDate(voucher.date))) {
      const newBookTransacttions = [...bookTransactions];
      newBookTransacttions[bookTransactionIndex] = {
        ...voucher,
        serial: 1,
        nextBalance: 0,
        prevBalance: 0,
      } as BookTransaction;

      updateBookState(book.id, (prev) => ({
        ...prev,
        transactions: newBookTransacttions,
      }));
    } else {
      const newBookTransactions = [...bookTransactions];
      newBookTransactions.splice(bookTransactionIndex, 1);

      const indexToInsert = newBookTransactions.filter(
        (t) =>
          dayjs(fireDate(t.date)).isBefore(voucher.date) ||
          dayjs(fireDate(t.date)).isSame(voucher.date)
      ).length;

      newBookTransactions.splice(indexToInsert, 0, {
        ...voucher,
        serial: 1,
        nextBalance: 0,
        prevBalance: 0,
      } as BookTransaction);

      updateBookState(book.id, (prev) => ({
        ...prev,
        transactions: newBookTransactions,
      }));
    }
  };

  return {
    addTransactionInBook,
    removeTransactionInBook,
    updateTransactionInBook,
  };
};
