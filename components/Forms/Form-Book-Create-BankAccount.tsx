'use client';

import { useUserAutoCompleteDataDB } from '@/db';
import { CreateBankAccountSchema, Group } from '@/schema';
import { useBookActions } from '@/state';
import { RNGForm } from '@rng-apps/forms';
import React from 'react';

const FormBookCreateBankAccount: React.FC<{
  onSuccess?: () => void;
  parentGroup: Group;
  isFd?: boolean;
}> = ({ onSuccess, parentGroup, isFd = false }) => {
  const { createBankAccount } = useBookActions();
  const { options, addOption } = useUserAutoCompleteDataDB('bank-name');
  const { options: ifscOptions, addOption: addIfscOptions } =
    useUserAutoCompleteDataDB('bank-ifsc');

  return (
    <RNGForm
      className="max-w-sm mx-auto"
      name="create-book-bank-account-form"
      schema={CreateBankAccountSchema}
      defaultValues={{
        parentGroup,
        accountNumber: undefined,
        balance: 0,
        bankName: undefined,
        description: undefined,
        ifscCode: undefined,
        name: undefined,
      }}
      uiSchema={[
        {
          name: 'parentGroup',
          type: 'hidden',
        },
        {
          name: 'name',
          label: isFd ? 'Name of Fixed Deposit' : 'Name of Bank Acount',
          type: 'text',
          autoFocus: true,
        },
        {
          name: 'description',
          label: isFd
            ? 'Description of Fixed Deposit'
            : 'Description of Bank Acount',
          type: 'text',
        },
        {
          name: 'balance',
          label: 'Previous Balance (if any)',
          type: 'currency',
        },
        {
          name: 'bankName',
          label: 'Bank Name',
          type: 'autocomplete-creatable',
          options: options,
          onCreate: async (p) => await addOption(p),
        },
        {
          name: 'ifscCode',
          label: 'Bank IFSC Code',
          type: 'autocomplete-creatable',
          options: ifscOptions,
          onCreate: async (p) => await addIfscOptions(p),
        },
        {
          name: 'accountNumber',
          label: isFd ? 'Fixed Deposit Account No.' : 'Bank Acount Account No.',
          type: 'text',
        },
      ]}
      onSubmit={async (payload) => {
        await createBankAccount(payload, isFd);

        if (onSuccess) onSuccess();
      }}
    />
  );
};

export default FormBookCreateBankAccount;
