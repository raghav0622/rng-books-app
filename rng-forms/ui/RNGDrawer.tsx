'use client';

import { Drawer, DrawerProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export type RNGDrawerProps = {
  drawerProps?: Omit<
    DrawerProps,
    'scrollAreaComponent' | 'opened' | 'onClose' | 'children'
  >;
  trigger: (open: () => void) => React.ReactNode;
  content: (close: () => void) => React.ReactNode;
};

export const RNGDrawer: React.FC<RNGDrawerProps> = ({
  trigger,
  drawerProps,
  content,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer opened={opened} onClose={close} {...drawerProps}>
        {content(close)}
      </Drawer>
      {trigger(open)}
    </>
  );
};
