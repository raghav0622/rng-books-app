import {
  Book,
  BookBankAccount,
  BookBase,
  BookLedger,
  CreateBankAccount,
  CreateGeneralAccount,
  CreateLedgerBook,
} from '@/schema';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { FormError, cleanUndefined } from '@rng-apps/forms';
import { v4 } from 'uuid';
import { useBookState, useFYState } from '../1-atoms';
import { useFYActions } from './2-fy-actions';
import { useTransactionActions } from './4-transaction-actions';

export const useBookActions = () => {
  const { books } = useFYState();
  const { fyAction } = useFYActions();
  const { addBookState, deleteBookState, getBookState, updateBookState } =
    useBookState();
  const { addCarryTransaction, removeTransaction } = useTransactionActions();

  const isBookNameUnique = (name: string) =>
    books.filter(
      (book) => book.name.trim().toLowerCase() === name.trim().toLowerCase()
    ).length <= 0;

  // const isNewBookValid = () => {}

  const createLedger = async ({
    name,
    parentGroup,
    description,
  }: CreateLedgerBook) => {
    if (!isBookNameUnique(name)) {
      throw new FormError('Book Name must be unique', 'name');
    }

    const payload: BookLedger = {
      accountNumber: null,
      balance: 0,
      bankName: null,
      category: 'Ledger',
      editable: true,
      id: v4(),
      ifscCode: null,
      isBankAccount: false,
      isSelfBook: false,
      lastTransactionDate: null,
      locked: false,
      name,
      parentGroup: parentGroup.id,
      parentGroupName: parentGroup.name,
      recordType: 'Book',
      transactionCount: 0,
      transactions: [],
      type: 'Ledger',
      description,
    };

    const cleanedPayload = await cleanUndefined(payload);

    addBookState(cleanedPayload);

    notifications.show({
      color: 'green',
      title: 'Success!',
      message: 'Ledger: ' + payload.name + ', Successfully created!',
    });

    fyAction();
  };

  const createBankAccount = (
    {
      accountNumber,
      bankName,
      ifscCode,
      name,
      parentGroup,
      balance,
      description,
    }: CreateBankAccount,
    isFD?: boolean
  ) => {
    if (!isBookNameUnique(name)) {
      throw new FormError('Account Name must be unique', 'name');
    }

    const payload: BookBankAccount = {
      accountNumber,
      balance: 0,
      bankName,
      category: isFD ? 'Fixed Deposit' : 'Bank Account',
      editable: true,
      id: v4(),
      ifscCode,
      isBankAccount: true,
      isSelfBook: true,
      lastTransactionDate: null,
      locked: false,
      name,
      parentGroup: parentGroup.id,
      parentGroupName: parentGroup.name,
      recordType: 'Book',
      transactionCount: 0,
      transactions: [],
      type: 'Account',
      description: description || null,
    };

    addBookState(payload);

    if (balance !== 0) {
      addCarryTransaction(payload.id, balance);
    }

    notifications.show({
      color: 'green',
      title: 'Success!',
      message: 'Bank Account: ' + payload.name + ', Successfully created!',
    });

    fyAction();
  };

  const createGeneralAccount = async (
    {
      balance,
      isBankAccount,
      isSelfBook,
      name,
      parentGroup,
      accountNumber,
      bankName,
      description,
      ifscCode,
    }: CreateGeneralAccount,
    isFD?: boolean
  ) => {
    if (!isBookNameUnique(name)) {
      throw new FormError('Account Name must be unique', 'name');
    }

    const payload: BookBase = {
      accountNumber,
      balance: 0,
      bankName,
      category: isFD ? 'Fixed Deposit' : 'Bank Account',
      editable: true,
      id: v4(),
      ifscCode,
      isBankAccount: true,
      isSelfBook: true,
      lastTransactionDate: null,
      locked: false,
      name,
      parentGroup: parentGroup.id,
      parentGroupName: parentGroup.name,
      recordType: 'Book',
      transactionCount: 0,
      transactions: [],
      type: 'Account',
      description: description,
    };

    const cleanedPayload = await cleanUndefined(payload);

    addBookState(cleanedPayload);

    if (balance !== 0) {
      addCarryTransaction(payload.id, balance);
    }

    notifications.show({
      color: 'green',
      title: 'Success!',
      message: 'Account: ' + payload.name + ', Successfully created!',
    });

    fyAction();
  };

  const editLedger = async (
    id: string,
    previous: Book,
    { name, parentGroup, description }: CreateLedgerBook
  ) => {
    const payload = {
      name,
      parentGroup: parentGroup.id,
      parentGroupName: parentGroup.name,
      description,
    };

    if (
      previous.name === name &&
      previous.parentGroup === parentGroup.id &&
      previous.parentGroupName === parentGroup.name &&
      previous.description === payload.description
    ) {
      notifications.show({
        color: 'blue',
        title: 'No Changes!',
        message: 'Ledger: ' + name + ', no changes to be updated!',
      });
    } else {
      if (
        previous.name.trim().toLowerCase() !== name.trim().toLowerCase() &&
        !isBookNameUnique(name)
      ) {
        throw new FormError('Ledger Name must be unique', 'name');
      }

      const cleanedPayload = await cleanUndefined({ ...previous, ...payload });

      updateBookState(id, () => cleanedPayload);

      notifications.show({
        color: 'green',
        title: 'Success!',
        message: 'Ledger: ' + name + ', Successfully updated!',
      });

      fyAction();
    }
  };

  const deleteBook = (id: string) => {
    const book = getBookState(id);
    if (!book) return;

    modals.openConfirmModal({
      title: `Delete ${book.type}: ${book.name}`,
      children: <>Are you Sure?</>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: {
        size: 'compact-sm',
        autoFocus: true,
        //@ts-expect-error sadfsd
        'data-autofocus': true,
      },
      cancelProps: {
        size: 'compact-sm',
      },
      onConfirm: () => {
        book.transactions.forEach((transaction) => {
          removeTransaction(transaction.id, true);
        });

        notifications.show({
          color: 'red',
          title: 'Success!',
          message: book.type + ': ' + book.name + ', Successfully Deleted!',
        });

        deleteBookState(id);
        fyAction();
      },
    });
  };

  return {
    createBankAccount,
    createGeneralAccount,
    editLedger,
    createLedger,
    isBookNameUnique,
    deleteBook,
  };
};
