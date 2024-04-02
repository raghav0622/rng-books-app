'use client';
import AppLogo from '@/components/AppLogo';
import ToggleDarkMode from '@/components/ToggleDarkMode';
import UserMenu from '@/components/UserMenu';
import { AppBar, Toolbar } from '@mui/material';
import React, { PropsWithChildren } from 'react';

const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        sx={{ boxShadow: 0, borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar variant="dense" className="gap-2">
          <AppLogo />
          <div className="flex-grow" />
          <ToggleDarkMode />
          <UserMenu />
        </Toolbar>
      </AppBar>
      <>{children}</>
    </>
  );
};

export default AppLayout;
