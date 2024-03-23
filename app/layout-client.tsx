'use client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { PropsWithChildren } from 'react';
import AppProviders from './AppProviders';
import Authorization from './Authorization';
import { theme } from './theme';

const LayoutClient: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider modalProps={{}}>
        <AppProviders>
          <Authorization>{children}</Authorization>
        </AppProviders>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default LayoutClient;
