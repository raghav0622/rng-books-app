import { Transaction } from '@/schema';
import { useDisclosure } from '@mantine/hooks';

const EditCarryTransactionModal: React.FC<{
  transaction: Transaction;
  dateNotEditbale?: boolean;
  descriptionNotEditbale?: boolean;
  customChild?: (open: () => void) => React.ReactNode;
}> = ({
  transaction,
  dateNotEditbale,
  descriptionNotEditbale,
  customChild,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  // const { updateCarryTransaction } = useTransactionActions();

  if (transaction.transactionType !== 'carry-entry') return null;

  return null;
  // return (
  // <>
  {
    /* <Modal opened={opened} onClose={close} title={'Edit Transaction'}>
        <RNGForm
          name="edit-carry-transaction"
          schema={UpdateCarryTransactionSchema}
          defaultValues={{
            amount: transaction.amount,
            date: fireDate(transaction.date),
            description: transaction.description || undefined,
          }}
          uiSchema={[
            {
              name: 'date',
              label: `Date of transaction`,
              type: 'date',
              disabled: dateNotEditbale,
            },
            {
              name: 'amount',
              label: `Amount`,
              type: 'currency',
              autoFocus: true,
            },
            {
              name: 'description',
              label: 'Description',
              type: 'text',
              disabled: dateNotEditbale,
            },
          ]}
          submitButton={{ label: 'Save Changes' }}
          onSubmit={(payload) => {
            // updateCarryTransaction(transaction, payload);
            close();
          }}
        />
      </Modal>
      {customChild ? (
        customChild(open)
      ) : (
        <RNGActionIcon
          variant="outline"
          tooltip="Edit Transaction"
          size="sm"
          onClick={open}
        >
          <IconEditCircle />
        </RNGActionIcon>
      )}
    </> */
  }
  // );
};

export default EditCarryTransactionModal;
