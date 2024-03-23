import { Book, useGetDerived } from '@/_schema';
import { Anchor } from '@mantine/core';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';

export const useReadTransaction = (
  viewer: string,
  transactionId: string,
  baseUrl: string,
  router: ReturnType<typeof useRouter>
): { primary: React.ReactNode; secondary: React.ReactNode } => {
  const transaction = useGetDerived().getTransaction(transactionId);
  if (!transaction) return { primary: '', secondary: '' };

  const primaryBook = transaction.primaryBook;

  if (!primaryBook?.id) {
    return { primary: '', secondary: '' };
  }

  const bookLink = (book: Book, customTitle?: string) => (
    <Anchor
      onClick={() => router.push(baseUrl + '/book/' + book.id)}
      style={{ cursor: 'pointer' }}
    >
      {customTitle ? customTitle : book.name}
    </Anchor>
  );

  if (transaction.transactionType === 'carry-entry') {
    return { primary: transaction.description, secondary: null };
  } else {
    const secondaryBook = transaction.secondaryBook;
    if (secondaryBook) {
      if (transaction.transactionType === 'leger-entry') {
        let primary: React.ReactNode = null;

        if (viewer === primaryBook.id) {
          if (primaryBook.id === 'cash-book') {
            if (transaction.amount > 0)
              primary = <>Cash Received For {bookLink(secondaryBook)}</>;
            if (transaction.amount < 0)
              primary = <>Cash Payment for {bookLink(secondaryBook)}</>;
          } else {
            if (transaction.amount > 0)
              primary = <>Credit For {bookLink(secondaryBook)}</>;
            if (transaction.amount < 0)
              primary = <>Debit For {bookLink(secondaryBook)}</>;
          }
        }

        if (viewer === secondaryBook.id) {
          if (primaryBook.id === 'cash-book') {
            if (transaction.amount > 0)
              primary = <>{bookLink(primaryBook, 'Cash Received')}</>;
            if (transaction.amount < 0)
              primary = <>{bookLink(primaryBook, 'Cash Payment')}</>;
          } else {
            if (transaction.amount > 0)
              primary = <>Credit in {bookLink(primaryBook)}</>;
            if (transaction.amount < 0)
              primary = <>Debit from {bookLink(primaryBook)}</>;
          }
        }

        return { primary, secondary: transaction.description || null };
      } else {
        let primary: React.ReactNode = null;

        if (viewer === 'cash-book') {
          if (transaction.transactionType === 'self-to-self-entry') {
            if (transaction.amount > 0)
              primary = <>Cash withdrawal from {bookLink(secondaryBook)}</>;
            if (transaction.amount < 0)
              primary = <>Cash Deposit in {bookLink(secondaryBook)}</>;
          } else {
            if (transaction.amount > 0)
              primary = <>Cash Received From {bookLink(secondaryBook)}</>;
            if (transaction.amount < 0)
              primary = <>Cash Given To {bookLink(secondaryBook)}</>;
          }
        } else {
          if (secondaryBook.id !== 'cash-book') {
            if (transaction.transactionType === 'self-to-self-entry') {
              if (transaction.amount > 0)
                primary = <>Transfer (self) from {bookLink(secondaryBook)}</>;
              if (transaction.amount < 0)
                primary = <>Transfer (self) to {bookLink(secondaryBook)}</>;
            } else {
              if (transaction.amount > 0)
                primary = (
                  <>
                    {bookLink(secondaryBook)} to {primaryBook.name}
                  </>
                );
              if (transaction.amount < 0)
                primary = (
                  <>
                    {primaryBook.name} to {bookLink(secondaryBook)}
                  </>
                );
            }
          } else {
            if (transaction.transactionType === 'self-to-self-entry') {
              if (transaction.amount > 0)
                primary = <>{bookLink(secondaryBook, 'Cash Deposited')}</>;
              if (transaction.amount < 0)
                primary = <>{bookLink(secondaryBook, 'Cash Withdrawl')}</>;
            } else {
              if (transaction.amount > 0)
                primary = (
                  <>
                    {bookLink(secondaryBook, 'Cash Given')} to{' '}
                    {primaryBook.name}
                  </>
                );
              if (transaction.amount < 0)
                primary = (
                  <>
                    {bookLink(secondaryBook, 'Cash Received')} from{' '}
                    {primaryBook.name}
                  </>
                );
            }
          }
        }

        return { primary, secondary: transaction.description || null };
      }
    }
  }

  return { primary: null, secondary: null };
};

export default useReadTransaction;
