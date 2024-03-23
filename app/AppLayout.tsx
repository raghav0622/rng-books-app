'use client';
import AppLogo from '@/components/App/AppLogo';
import { Divider, Paper } from '@mantine/core';
import { SlotView } from '@rng-apps/forms';
import * as React from 'react';
import { UserMenu } from './UserMenu';

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Paper className="box-border !w-[100vw] !max-w-[100vw] flex gap-2 px-3 h-[48px] flex-nowrap items-center">
        <AppLogo />
        <SlotView
          name="appbar-middle-toolbar"
          nullContent={<div className="flex-grow" />}
        />
        <SlotView name="appbar-right-actions" />
        <UserMenu />
      </Paper>
      <Divider />
      {children}
    </>
  );
};

export default AppLayout;
