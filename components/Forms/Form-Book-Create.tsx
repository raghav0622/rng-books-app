'use client';

import { useUserAutoCompleteDataDB } from '@/db';
import {
  CreateBankAccountSchema,
  CreateGeneralAccountSchema,
  CreateLedgerBookSchema,
  Group,
  GroupSchema,
} from '@/schema';
import { useBookActions, useFYState } from '@/state';
import { RNGForm } from '@rng-apps/forms';
import React, { useState } from 'react';
import { z } from 'zod';

const FormBookCreateLegder: React.FC<{
  onSuccess?: () => void;
  parentGroup: Group;
}> = ({ onSuccess, parentGroup }) => {
  const { createLedger } = useBookActions();
  return (
    <RNGForm
      className="max-w-sm mx-auto"
      name="create-book-ledger-form"
      schema={CreateLedgerBookSchema}
      defaultValues={{ name: undefined, description: undefined, parentGroup }}
      uiSchema={[
        {
          name: 'parentGroup',
          type: 'hidden',
        },
        {
          name: 'name',
          label: 'Name of Ledger',
          type: 'text',
          autoFocus: true,
        },
        {
          name: 'description',
          label: 'Description of Ledger',
          type: 'text',
        },
      ]}
      onSubmit={async (t) => {
        await createLedger(t);

        if (onSuccess) onSuccess();
      }}
    />
  );
};

const FormBookCreateGeneralAccount: React.FC<{
  onSuccess?: () => void;
  parentGroup: Group;
  isFa?: boolean;
}> = ({ onSuccess, parentGroup, isFa = false }) => {
  const { createGeneralAccount } = useBookActions();
  const { options, addOption } = useUserAutoCompleteDataDB('bank-name');
  const { options: ifscOptions, addOption: addIfscOptions } =
    useUserAutoCompleteDataDB('bank-ifsc');

  return (
    <RNGForm
      className="max-w-sm mx-auto"
      name="create-book-general-account-form"
      schema={CreateGeneralAccountSchema}
      defaultValues={{
        parentGroup,
        accountNumber: undefined,
        balance: undefined,
        bankName: undefined,
        description: undefined,
        ifscCode: undefined,
        isBankAccount: false,
        isSelfBook: isFa,
        name: undefined,
      }}
      onChange={(t) => {
        console.log(t);
      }}
      uiSchema={[
        {
          name: 'parentGroup',
          type: 'hidden',
        },
        {
          name: 'name',
          label: 'Name of Book',
          type: 'text',
          autoFocus: true,
        },
        {
          name: 'description',
          label: 'Description of Book',
          type: 'text',
        },
        {
          name: 'balance',
          label: 'Previous Balance (if any)',
          type: 'currency',
        },
        {
          name: 'isSelfBook',
          label: 'Is Book of Self',
          type: 'switch',
          renderLogic: ({ parentGroup }) => {
            if (parentGroup.category === 'Fixed Asset') return false;
            else return true;
          },
        },
        {
          name: 'isBankAccount',
          label: 'Add Bank Details',
          type: 'switch',
          renderLogic: ({ parentGroup }) =>
            parentGroup.category === 'Balance Sheet',
          valueOnNoRender: ({ parentGroup }) => {
            if (parentGroup.category !== 'Balance Sheet') return false;
          },
        },

        {
          name: 'bankName',
          label: 'Bank Name',
          type: 'autocomplete-creatable',
          options: options,
          onCreate: async (p) => await addOption(p),
          renderLogic: (data) => !!data.isBankAccount,
          valueOnNoRender: (data) => {
            if (!data.isBankAccount) return undefined;
          },
        },
        {
          name: 'ifscCode',
          label: 'Bank IFSC Code',
          type: 'autocomplete-creatable',
          options: ifscOptions,
          onCreate: async (p) => await addIfscOptions(p),
          renderLogic: (data) => !!data.isBankAccount,
          valueOnNoRender: (data) => {
            if (!data.isBankAccount) return undefined;
          },
        },
        {
          name: 'accountNumber',
          label: 'Account No.',
          type: 'text',
          renderLogic: (data) => !!data.isBankAccount,
          valueOnNoRender: (data) => {
            if (!data.isBankAccount) return undefined;
          },
        },
      ]}
      onSubmit={async (payload) => {
        await createGeneralAccount(payload);

        if (onSuccess) onSuccess();
      }}
    />
  );
};

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

const FormBookCreate: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const fy = useFYState();
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
      {group?.category === 'Fixed Asset' && (
        <FormBookCreateGeneralAccount
          onSuccess={onSuccess}
          parentGroup={group}
          isFa
        />
      )}
    </>
  );
};

export default FormBookCreate;
