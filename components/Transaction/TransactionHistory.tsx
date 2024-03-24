'use client';

import { useFYState, useFYStateDerivatives } from '@/state';
import { Alert, Divider, Group, Paper, Text } from '@mantine/core';
import { RNGButton } from '@rng-apps/forms';
import { useMemo, useState } from 'react';
import ViewTransaction from './ViewTransaction';

function TransactionHistory() {
  const { fy } = useFYState();
  const { selfBooks } = useFYStateDerivatives();
  const [view, setView] = useState<
    'all' | 'self' | 'ledger' | 'cash' | 'other'
  >('all');

  const transactions = useMemo(() => {
    const print: string[] = [];

    if (view === 'all') {
      fy.transactions.forEach((t) => {
        if (t.transactionType === 'carry-entry') print.push(t.id);
        if (t.transactionType === 'leger-entry') print.push(t.id);
        if (
          t.transactionType === 'self-to-other-entry' &&
          selfBooks.findIndex((b) => b.id === t.primaryBook) !== -1
        ) {
          print.push(t.id);
        }
        if (t.transactionType === 'self-to-self-entry' && t.amount >= 0) {
          print.push(t.id);
        }
      });
    }
    if (view === 'cash') {
      fy.transactions.forEach((t) => {
        t.primaryBook === 'cash-book' && print.push(t.id);
      });
    }
    if (view === 'self') {
      fy.transactions.forEach((t) => {
        t.transactionType === 'self-to-self-entry' && print.push(t.id);
      });
    }
    if (view === 'other') {
      fy.transactions.forEach((t) => {
        t.transactionType === 'self-to-other-entry' &&
          t.amount >= 0 &&
          print.push(t.id);
      });
    }

    if (view === 'ledger') {
      fy.transactions.forEach((t) => {
        t.transactionType === 'leger-entry' && print.push(t.id);
      });
    }

    return print.reverse();
  }, [fy.transactions, selfBooks, view]);

  return (
    <>
      <Paper className="sticky top-0 z-50">
        <Text>Transaction Count: {transactions.length}</Text>
        <Group gap="xs" py="sm">
          <RNGButton
            size="compact-sm"
            color={view === 'all' ? 'blue' : 'gray'}
            onClick={() => setView('all')}
          >
            All Entries
          </RNGButton>
          <RNGButton
            size="compact-sm"
            color={view === 'ledger' ? 'blue' : 'gray'}
            onClick={() => setView('ledger')}
          >
            Ledger Entries
          </RNGButton>
          <RNGButton
            size="compact-sm"
            color={view === 'cash' ? 'blue' : 'gray'}
            onClick={() => setView('cash')}
          >
            Cash Entries
          </RNGButton>
          <RNGButton
            size="compact-sm"
            color={view === 'self' ? 'blue' : 'gray'}
            onClick={() => setView('self')}
          >
            Self Entries
          </RNGButton>
          <RNGButton
            size="compact-sm"
            color={view === 'other' ? 'blue' : 'gray'}
            onClick={() => setView('other')}
          >
            Third Party Entries
          </RNGButton>
        </Group>
        <Divider />
      </Paper>
      {transactions.length > 0 ? (
        <>
          {transactions.map((t) => (
            <ViewTransaction key={t} id={t} />
          ))}
        </>
      ) : (
        <Alert>No Transactions to Show</Alert>
      )}
    </>
  );
}

export default TransactionHistory;
