import { RNGDrawer, RNGDrawerProps, useDevice } from '@rng-apps/forms';
import FormTransactionCreate from '../Forms/Form-Transaction-Create';

const DrawerTransactionCreate: React.FC<{
  trigger: RNGDrawerProps['trigger'];
}> = ({ trigger }) => {
  const { isDesktop } = useDevice();

  return (
    <RNGDrawer
      drawerProps={{
        offset: 8,
        radius: 'md',
        position: isDesktop ? 'right' : 'bottom',
        title: 'Add Transaction Voucher',
      }}
      content={(close) => <FormTransactionCreate onSuccess={close} />}
      trigger={trigger}
    />
  );
};

export default DrawerTransactionCreate;
