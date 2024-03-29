'use client';

import { useTransactionState } from '@/state';
import { Button } from '@mantine/core';
import EditCarryTransactionModal from './EditCarryTransaction';

const EditCapitalTransactionBtn: React.FC<{
  customChild?: (open: () => void) => React.ReactNode;
}> = ({ customChild }) => {
  const { getTransactionState } = useTransactionState();
  const transaction = getTransactionState('capital-open-entry');
  if (!transaction) return null;
  return (
    <EditCarryTransactionModal
      transaction={transaction}
      dateNotEditbale
      descriptionNotEditbale
      customChild={
        customChild
          ? (open) => customChild(open)
          : (open) => (
              <Button size="compact-xs" onClick={open}>
                Edit Capital B/F
              </Button>
            )
      }
    />
  );
};

export default EditCapitalTransactionBtn;
