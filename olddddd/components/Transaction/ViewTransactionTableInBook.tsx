'use client';

import { BookTransaction } from '@/schema';
import {
  useFYDerivedState,
  useGetDerived,
  useTransactionActions,
  useTransactionState,
} from '@/state';
import { Group, Stack, Table, TableScrollContainer } from '@mantine/core';
import { RNGActionIcon, currency, fireDateString } from '@rng-apps/forms';
import { IconTrashXFilled } from '@tabler/icons-react';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import EditCarryTransactionModal from './EditCarryTransaction';
// import EditTransactionInBookModal from './EditTransactionInBook';
import useReadTransaction from './useReadTransaction';

const TransactionActions: React.FC<{
  serial: number;
  transactionId: string;
}> = ({ transactionId, serial }) => {
  const { getTransactionState } = useTransactionState();
  const { removeTransaction } = useTransactionActions();
  const transaction = getTransactionState(transactionId);

  if (!transaction) return null;

  return (
    <Group gap="xs">
      {transaction.transactionType === 'carry-entry' && (
        <EditCarryTransactionModal
          transaction={transaction}
          dateNotEditbale={serial === 1}
        />
      )}

      <RNGActionIcon
        tooltip="Delete Transaction"
        onClick={() => removeTransaction(transaction.id)}
        color="red"
        size="sm"
        variant="outline"
      >
        <IconTrashXFilled />
      </RNGActionIcon>
    </Group>
  );
};

const TransasctionEntryMdAbove: React.FC<{
  viewer: string;
  transaction: BookTransaction;
}> = ({ viewer, transaction }) => {
  const router = useRouter();
  const { baseUrl } = useFYDerivedState();

  const { primary, secondary } = useReadTransaction(
    viewer,
    transaction.id,
    baseUrl,
    router
  );

  return (
    <Table.Tr>
      <Table.Td style={{ textAlign: 'center' }}>{transaction.serial}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        {fireDateString(transaction.date)}
      </Table.Td>
      <Table.Td>
        <Stack gap={0.5}>
          <span>{primary}</span>
          {!!secondary && <span>{secondary}</span>}
        </Stack>
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        {transaction.amount < 0 ? currency(-transaction.amount) : '-'}
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        {transaction.amount > 0 ? currency(transaction.amount) : '-'}
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        {currency(transaction.nextBalance, true)}
      </Table.Td>
      <Table.Td>
        <TransactionActions
          transactionId={transaction.id}
          serial={transaction.serial}
        />
      </Table.Td>
    </Table.Tr>
  );
};
const ViewTransactionTableInBook: React.FC<{
  id: string;
}> = ({ id }) => {
  const book = useGetDerived().getBook(id);
  if (!book) return null;

  return (
    <TableScrollContainer minWidth={1}>
      <Table
        highlightOnHover
        withTableBorder
        withRowBorders
        withColumnBorders
        style={{ tableLayout: 'auto' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: 'center' }}>#</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>Date</Table.Th>
            <Table.Th style={{ textAlign: 'center' }}>Particular</Table.Th>
            <Table.Th style={{ textAlign: 'center', minWidth: 60 }}>
              DR
            </Table.Th>
            <Table.Th style={{ textAlign: 'center', minWidth: 60 }}>
              CR
            </Table.Th>
            <Table.Th style={{ textAlign: 'center', minWidth: 60 }}>
              Balance
            </Table.Th>
            <Table.Th style={{ textAlign: 'center', minWidth: 60 }}>
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {book?.transactions?.map((transaction) => (
            <TransasctionEntryMdAbove
              transaction={transaction}
              viewer={book.id}
              key={transaction.id}
            />
          ))}
        </Table.Tbody>
      </Table>
    </TableScrollContainer>
  );
};

export default ViewTransactionTableInBook;
