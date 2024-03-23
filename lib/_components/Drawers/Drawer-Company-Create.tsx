import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RNGButton } from '@rng-apps/forms';
import FormCompanyCreate from '../Forms/Form-Company-Create';

function DrawerCompanyCreate() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create New Company">
        <FormCompanyCreate onSuccess={close} />
      </Modal>
      <RNGButton size="compact-md" onClick={open} shortcut="Shift+N">
        Create Company
      </RNGButton>
    </>
  );
}

export default DrawerCompanyCreate;
