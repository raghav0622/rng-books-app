import { CreateCompanySchema, useCompanyDB } from '@/_schema';
import { RNGForm } from '@rng-apps/forms';

const FormCompanyCreate: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const { createCompany } = useCompanyDB();

  return (
    <RNGForm
      name="create-company-form"
      schema={CreateCompanySchema}
      defaultValues={{ name: undefined }}
      description="Name can not be changed, after creation of company."
      uiSchema={[
        {
          name: 'name',
          label: 'Name of New Company',
          type: 'text',
          autoFocus: true,
        },
      ]}
      submitButton={{ label: 'Create Compay' }}
      onSubmit={async (payload) => {
        await createCompany(payload);
        if (onSuccess) onSuccess();
      }}
    />
  );
};

export default FormCompanyCreate;
