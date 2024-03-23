'use client';
import { useFYActions } from '@/_schema';
import { notifications } from '@mantine/notifications';
import React, { PropsWithChildren, useEffect } from 'react';
import FYProvider from '../Providers/FYProvider';
import LayoutHeader from './LayoutHeader';

const FYLayoutWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { canSaveFY, saveFYChanges } = useFYActions();
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (canSaveFY) {
        await saveFYChanges();
        notifications.show({
          title: 'Data Autosaved',
          message: 'Recent changes have been automatically saved',
          color: 'green',
          withBorder: true,
        });
      }
    }, 30000);

    // Clean up the interval to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [canSaveFY, saveFYChanges]);

  return (
    <>
      <LayoutHeader />
      <div className="overflow-hidden flex h-full max-w-[100dvw]">
        {children}
      </div>
    </>
  );
};

const FYLayout: React.FC<PropsWithChildren<{ id: string }>> = ({
  children,
  id,
}) => {
  return (
    <FYProvider id={id}>
      <FYLayoutWrapper>{children}</FYLayoutWrapper>
    </FYProvider>
  );
};
export default FYLayout;
