'use client';
import { PropsWithChildren } from 'react';
import AppProviders from './AppProviders';
import Authorization from './Authorization';

import '@rng-apps/forms/index.esm.css';

const LayoutClient: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppProviders>
      <Authorization>{children}</Authorization>
    </AppProviders>
  );
};

export default LayoutClient;
