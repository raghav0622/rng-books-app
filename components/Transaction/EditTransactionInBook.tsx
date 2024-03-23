import { Transaction, UpdateTransactionSchema } from '@/schema';
import { useFYState, useTransactionActions } from '@/state';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RNGActionIcon, RNGForm, fireDate } from '@rng-apps/forms';
import { IconEditCircle } from '@tabler/icons-react';

const EditTransactionInBookModal: React.FC<{
  transaction: Transaction;
}> = ({ transaction }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { updateTransaction } = useTransactionActions();
  const { fy } = useFYState();

  if (
    transaction.transactionType === 'carry-entry' ||
    !transaction.secondaryBook
  )
    return null;

  return (
    <>
      <Modal opened={opened} onClose={close} title={'Edit Transaction'}>
        <RNGForm
          name="edit-carry-transaction"
          schema={UpdateTransactionSchema}
          defaultValues={{
            amount: transaction.amount,
            date: fireDate(transaction.date),
            description: transaction.description || undefined,
            secondaryBook: transaction.secondaryBook,
            primaryBook: transaction.primaryBook,
          }}
          uiSchema={[
            {
              name: 'primaryBook',
              type: 'autocomplete-basic',
              label: 'Primary Book',
              options: fy.books.filter((b) => b.type === 'Account'),
              getOptionLabel: (opt) => opt.name,
              getOptionValue: (opt) => opt.id,
              disabled: true,
            },
            {
              name: 'secondaryBook',
              type: 'autocomplete-basic',
              label: 'Secondary Book',
              options: fy.books.filter(
                (b) =>
                  b.id !== 'capital-from-previous-year' &&
                  b.id !== transaction.primaryBook
              ),
              getOptionLabel: (opt) => opt.name,
              getOptionValue: (opt) => opt.id,
              autoFocus: true,
            },
            {
              name: 'date',
              label: `Date of Transaction`,
              type: 'date',
              minDate: new Date(fy.startYear, 3, 1),
              maxDate: new Date(fy.endYear, 2, 31),
            },
            {
              name: 'amount',
              label: `Amount`,
              type: 'currency',
            },
            {
              name: 'description',
              label: `Description`,
              type: 'text',
            },
          ]}
          submitButton={{ label: 'Save Changes' }}
          onSubmit={(payload) => {
            updateTransaction(transaction, payload);
            close();
          }}
        />
      </Modal>
      <RNGActionIcon
        variant="outline"
        tooltip="Edit Transaction"
        size="sm"
        onClick={open}
      >
        <IconEditCircle />
      </RNGActionIcon>
    </>
  );
};
export default EditTransactionInBookModal;
