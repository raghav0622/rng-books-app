'use client';

import FormTransactionCreateCarry from '@/forms/Form-Transaction-Create-Carry';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RNGButton } from '@rng-apps/forms';

const DrawerTransacttionCreateCarry: React.FC<{ bookId: string }> = ({
  bookId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={'Add Balance from previous year'}
      >
        <FormTransactionCreateCarry bookId={bookId} onSuccess={close} />
      </Modal>
      <RNGButton size="xs" onClick={open} shortcut="Shift+C">
        Add Prev. Year Balance
      </RNGButton>
    </>
  );
};

export default DrawerTransacttionCreateCarry;
