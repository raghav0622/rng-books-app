'use client';
import FormBookCreate from '@/forms/Form-Book-Create';
import { RNGDrawer, RNGDrawerProps, useDevice } from '@rng-apps/forms';

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
