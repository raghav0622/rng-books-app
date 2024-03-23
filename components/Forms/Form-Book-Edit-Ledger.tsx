import { Book, CreateLedgerBookSchema } from '@/schema';
import { useBookActions, useFYStateDerivatives } from '@/state';

import { RNGForm } from '@rng-apps/forms';
import React from 'react';

const FormBookEditLegder: React.FC<{
  onSuccess?: () => void;
  previous: Book;
}> = ({ onSuccess, previous }) => {
  const { capitalGroups } = useFYStateDerivatives();
  const { editLedger } = useBookActions();
  return (
    <RNGForm
      className="max-w-sm mx-auto"
      name="edit-ledger-form"
      schema={CreateLedgerBookSchema}
      defaultValues={{
        name: previous.name,
        description: previous.description,
        parentGroup: capitalGroups.find((i) => i.id === previous.parentGroup),
      }}
      uiSchema={[
        {
          name: 'parentGroup',
          type: 'autocomplete-basic',
          label: 'Parent Group',
          options: capitalGroups,
          getOptionLabel: (opt) => opt.name,
          getOptionValue: (opt) => opt,
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
        await editLedger(previous.id, previous, t);

        if (onSuccess) onSuccess();
      }}
    />
  );
};

export default FormBookEditLegder;
