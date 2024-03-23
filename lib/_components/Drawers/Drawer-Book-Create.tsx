import { RNGDrawer, RNGDrawerProps, useDevice } from '@rng-apps/forms';
import FormBookCreate from '../Forms/Form-Book-Create';

const DrawerBookCreate: React.FC<{
  trigger: RNGDrawerProps['trigger'];
}> = ({ trigger }) => {
  const { isDesktop } = useDevice();

  return (
    <RNGDrawer
      drawerProps={{
        offset: 8,
        radius: 'md',
        position: isDesktop ? 'right' : 'bottom',
        title: 'Create New Book',
      }}
      content={(close) => <FormBookCreate onSuccess={close} />}
      trigger={trigger}
    />
  );
};

export default DrawerBookCreate;
