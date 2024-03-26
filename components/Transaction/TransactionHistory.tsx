'use client';

import { useFYDerivedState } from '@/state';
import { Alert, Divider, Group, Paper, Text } from '@mantine/core';
import { RNGButton } from '@rng-apps/forms';
import { useMemo, useState } from 'react';
import ViewTransaction from './ViewTransaction';

function TransactionHistory() {
  const {
    fy,
    cashEntries,
    allEntries,
    otherEntries,
    ledgerEntries,
    selfEntries,
  } = useFYDerivedState();
  const [view, setView] = useState<
    'all' | 'self' | 'ledger' | 'cash' | 'other'
  >('all');

  const transactions = useMemo(() => {
    if (view === 'all') return allEntries;
    if (view === 'cash') return cashEntries;
    if (view === 'self') return selfEntries;
    if (view === 'other') return otherEntries;
    if (view === 'ledger') return ledgerEntries;
    return [];
  }, [allEntries, cashEntries, ledgerEntries, otherEntries, selfEntries, view]);

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
          {transactions.toReversed().map((t) => (
            <ViewTransaction key={t.id + 'print'} transaction={t} />
          ))}
        </>
      ) : (
        <Alert>No Transactions to Show</Alert>
      )}
    </>
  );
}

export default TransactionHistory;
