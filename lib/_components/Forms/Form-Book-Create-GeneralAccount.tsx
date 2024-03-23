import {
  CreateGeneralAccountSchema,
  Group,
  useBookActions,
  useUserAutoCompleteDataDB,
} from '@/_schema';
import { RNGForm } from '@rng-apps/forms';
import React from 'react';

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
        isSelfBook: false,
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
          label: 'Name',
          type: 'text',
          autoFocus: true,
        },
        {
          name: 'description',
          label: 'Description',
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
        },
        {
          name: 'isBankAccount',
          label: 'Add Bank Details',
          type: 'switch',
          renderLogic: ({ parentGroup }) => {
            if (parentGroup && parentGroup.type === 'Account') {
              if (
                parentGroup.id === 'bank-account' ||
                parentGroup.id === 'fixed-deposit' ||
                parentGroup.id === 'fixed-asset'
              )
                return false;
              else return true;
            } else return false;
          },
          valueOnNoRender: ({ parentGroup }) => {
            if (parentGroup && parentGroup.type === 'Account') {
              if (
                parentGroup.id === 'bank-account' ||
                parentGroup.id === 'fixed-deposit'
              )
                return true;
              else return false;
            } else return false;
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

export default FormBookCreateGeneralAccount;
