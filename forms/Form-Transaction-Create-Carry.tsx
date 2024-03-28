'use client';

import { useTransactionActions } from '@/state';
import { RNGForm, number } from '@rng-apps/forms';
import { z } from 'zod';

const FormTransactionCreateCarry: React.FC<{
  bookId: string;
  onSuccess?: () => void;
}> = ({ bookId, onSuccess }) => {
  const { addCarryTransaction } = useTransactionActions();

  return (
    <RNGForm
      name="add-carry-transaction"
      schema={z.object({ balance: number })}
      defaultValues={{
        balance: 0,
      }}
      uiSchema={[
        {
          name: 'balance',
          label: 'Previous Year Balance',
          type: 'currency',
          autoFocus: true,
        },
      ]}
      submitButton={{ label: 'Confirm' }}
      onSubmit={({ balance }) => {
        addCarryTransaction(bookId, balance);
        if (onSuccess) onSuccess();
      }}
    />
  );
};

export default FormTransactionCreateCarry;
