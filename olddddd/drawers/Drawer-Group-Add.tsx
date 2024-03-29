'use client';

import FormGroupCreate from '@/forms/Form-Group-Create';
import { RNGDrawer, RNGDrawerProps, useDevice } from '@rng-apps/forms';

const DrawerAddGroup: React.FC<{
  trigger: RNGDrawerProps['trigger'];
}> = ({ trigger }) => {
  const { isDesktop } = useDevice();

  return (
    <RNGDrawer
      drawerProps={{
        offset: 8,
        radius: 'md',
        position: isDesktop ? 'right' : 'bottom',
        title: 'Create New Group',
      }}
      content={(close) => <FormGroupCreate onSuccess={close} />}
      trigger={trigger}
    />
  );
};

export default DrawerAddGroup;
