'use client';

import { Group, GroupSchema } from '@/schema';
import { useFYState } from '@/state';
import { RNGForm } from '@rng-apps/forms';
import React, { useState } from 'react';
import { z } from 'zod';
import FormBookCreateBankAccount from './Form-Book-Create-BankAccount';
import FormBookCreateGeneralAccount from './Form-Book-Create-GeneralAccount';
import FormBookCreateLegder from './Form-Book-Create-Ledger';

const FormBookCreate: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const { fy } = useFYState();
  const [group, setGroup] = useState<Group | undefined>(undefined);

  return (
    <>
      <RNGForm
        className="max-w-sm mx-auto"
        name="create-book-group-select-form"
        schema={z.object({ parentGroup: GroupSchema })}
        defaultValues={{ parentGroup: undefined }}
        onChange={(t) => {
          if (group?.id !== t.parentGroup?.id) {
            setGroup(t.parentGroup);
          }
        }}
        uiSchema={[
          {
            name: 'parentGroup',
            type: 'autocomplete-basic',
            label: 'Parent Group',
            options: fy.groups,
            autoFocus: true,
            getOptionLabel: (opt) => opt.name,
            getOptionValue: (opt) => opt,
          },
        ]}
      />
      {group?.category === 'Ledger' && (
        <FormBookCreateLegder onSuccess={onSuccess} parentGroup={group} />
      )}
      {group?.category === 'Bank Account' && (
        <FormBookCreateBankAccount onSuccess={onSuccess} parentGroup={group} />
      )}
      {group?.category === 'Fixed Deposit' && (
        <FormBookCreateBankAccount
          isFd
          onSuccess={onSuccess}
          parentGroup={group}
        />
      )}
      {group?.category === 'Balance Sheet' && (
        <FormBookCreateGeneralAccount
          onSuccess={onSuccess}
          parentGroup={group}
        />
      )}
    </>
  );
};

export default FormBookCreate;
