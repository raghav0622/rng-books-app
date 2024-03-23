import { CreateGroupSchema } from '@/schema';
import { useFYStateDerivatives, useGroupActions } from '@/state';
import { RNGForm } from '@rng-apps/forms';

const FormGroupCreate: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const { createGroupsOption } = useFYStateDerivatives();
  const { createGroup } = useGroupActions();

  return (
    <RNGForm
      className="max-w-sm mx-auto"
      name="create-group-form"
      schema={CreateGroupSchema}
      defaultValues={{
        parentGroup: undefined,
        name: undefined,
        description: undefined,
        exploded: false,
        childGroupsPossible: false,
        balanceCRLabel: undefined,
        balanceDRLabel: undefined,
      }}
      onSubmit={async (data) => {
        await createGroup(data);
        if (onSuccess) onSuccess();
      }}
      submitButton={{ label: 'Create Group' }}
      uiSchema={[
        {
          name: 'parentGroup',
          type: 'autocomplete-basic',
          label: 'Parent Group',
          options: createGroupsOption,
          autoFocus: true,
          getOptionLabel: (opt) => opt.name,
          getOptionValue: (opt) => opt,
        },
        {
          name: 'name',
          label: `Name of Group`,
          type: 'text',
          renderLogic: (data) => !!data.parentGroup,
        },
        {
          name: 'description',
          label: `Description of Group`,
          type: 'text',
          renderLogic: (data) => !!data.parentGroup,
        },
        {
          name: 'exploded',
          label: `Are Group entries to be shown as Single Entries in Parent Group?`,
          type: 'switch',
          renderLogic: (data) => !!data.parentGroup,
        },
        {
          name: 'balanceDRLabel',
          label: `Label if Group Balance >= 0`,
          type: 'text',

          renderLogic: (data) =>
            Boolean(!!data.parentGroup && data.parentGroup?.type !== 'Account'),

          valueOnNoRender: ({ parentGroup }) =>
            parentGroup?.type === 'Account'
              ? 'Transfer to ' + parentGroup?.name + ' (DR)'
              : undefined,
        },
        {
          name: 'balanceCRLabel',
          label: `Label if Group Balance < 0`,
          type: 'text',
          renderLogic: (data) =>
            Boolean(!!data.parentGroup && data.parentGroup?.type !== 'Account'),

          valueOnNoRender: ({ parentGroup }) =>
            parentGroup?.type === 'Account'
              ? 'Transfer to ' + parentGroup?.name + ' (CR)'
              : undefined,
        },
      ]}
    />
  );
};

export default FormGroupCreate;
