'use client';

import { useFYDerivedState } from '@/state';
import {
  Anchor,
  Card,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { currency, fireDate } from '@rng-apps/forms';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import { TransactionDerived } from '../../1-schema/schema-05-transaction-derived';
import useReadTransaction from './useReadTransaction';

const ViewTransaction: React.FC<{
  transaction: TransactionDerived;
  book?: boolean;
}> = ({ transaction }) => {
  const { baseUrl } = useFYDerivedState();
  const router = useRouter();
  const theme = useMantineTheme();

  const { primary, secondary } = useReadTransaction(
    transaction?.primaryBook.id || ' ',
    transaction?.id || ' ',
    baseUrl,
    router
  );

  if (!transaction) return null;

  return (
    <Card withBorder p="xs">
      <Stack gap={2}>
        <Text size="xs" className="flex-grow" truncate>
          {fireDate(transaction.date).toDateString()}
        </Text>
        <Group gap="xs" wrap="nowrap">
          <Anchor
            onClick={() =>
              router.push(baseUrl + '/book/' + transaction.primaryBook.id)
            }
            size="sm"
            className="font-semibold flex-grow"
            truncate
          >
            {transaction.primaryBook.id === 'cash-book'
              ? 'Cash'
              : transaction.primaryBook.name}
          </Anchor>
          <Text
            className="flex-shrink-0"
            size="sm"
            c={transaction.amount >= 0 ? theme.colors.green[9] : 'red'}
          >
            {currency(transaction.amount, true)}
          </Text>
        </Group>

        <Text size="sm">{primary}</Text>
        {secondary && (
          <Text size="sm" c="gray">
            {secondary}
          </Text>
        )}
      </Stack>
    </Card>
  );
};

export default ViewTransaction;
