import { CreateLedgerBookSchema, Group } from '@/schema';
import { useBookActions } from '@/state';
import { RNGForm } from '@rng-apps/forms';
import React from 'react';

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

export default FormBookCreateLegder;
