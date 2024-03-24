'use client';

import { CreateTransactionSchema } from '@/schema';
import {
  useFYState,
  useFYStateDerivatives,
  useTransactionActions,
} from '@/state';
import { RNGForm, string } from '@rng-apps/forms';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

const FormTransactionCreate: React.FC<{
  onSuccess?: () => void;
}> = ({ onSuccess }) => {
  const { fy } = useFYState();
  const { ledgers, selfBooks } = useFYStateDerivatives();
  const pathname = usePathname().split('/');
  const pathBook = pathname[3] === 'book' ? pathname[4] : undefined;
  const isPathBookLedger = ledgers.findIndex((b) => b.id === pathBook) !== -1;
  const isNotSelfAccount = selfBooks.findIndex((b) => b.id === pathBook) === -1;

  const { addSimpleTransaction } = useTransactionActions();
  const [primaryId, setPrimaryId] = useState<string | undefined>(
    isPathBookLedger || isNotSelfAccount ? undefined : pathBook
  );
  return (
    <>
      <RNGForm
        name="add-new-transaction-primary-book"
        schema={z.object({ primaryBook: string })}
        onChange={(t) => setPrimaryId(t.primaryBook)}
        defaultValues={{
          primaryBook: primaryId || undefined,
        }}
        uiSchema={[
          {
            name: 'primaryBook',
            type: 'autocomplete-basic',
            label: 'Primary Book',
            groupBy: 'type',
            getOptionLabel: (opt) => opt.name,
            getOptionValue: (opt) => opt.id,
            options: selfBooks,
            autoFocus: true,
          },
        ]}
      />
      <RNGForm
        key={primaryId}
        name="add-new-transaction"
        schema={CreateTransactionSchema}
        defaultValues={{
          amount: 0,
          date: new Date(),
          description: undefined,
          secondaryBook:
            isPathBookLedger || isNotSelfAccount ? pathBook : undefined,
          primaryBook: primaryId,
        }}
        uiSchema={[
          {
            name: 'primaryBook',
            type: 'hidden',
          },
          {
            name: 'secondaryBook',
            type: 'autocomplete-basic',
            label: 'Secondary Book',
            groupBy: 'type',
            getOptionLabel: (opt) => opt.name,
            getOptionValue: (opt) => opt.id,
            options: fy.books.filter(
              (b) =>
                b.id !== primaryId &&
                b.id !== 'capital-from-previous-year' &&
                !b.locked
            ),
            autoFocus: true,
          },
          {
            name: 'date',
            label: `Date of Transaction`,
            type: 'date',
            minDate: new Date(fy.startYear, 3, 1),
            maxDate: new Date(fy.endYear, 2, 31),
          },
          {
            name: 'amount',
            label: `Amount`,
            type: 'currency',
          },
          {
            name: 'description',
            label: `Description`,
            type: 'text',
          },
        ]}
        submitButton={{ label: 'Confirm' }}
        onSubmit={(payload) => {
          addSimpleTransaction(payload);
          if (onSuccess) onSuccess();
        }}
      />
    </>
  );
};

export default FormTransactionCreate;
