'use client';
import { useFYActions, useFYDerivedState } from '@/state';
import { Anchor, Badge } from '@mantine/core';
import { modals } from '@mantine/modals';
import { RNGButton } from '@rng-apps/forms';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import React from 'react';

export const useFYCommonActions = () => {
  const router = useRouter();
  const { canSaveFY, saveFYChanges } = useFYActions();

  const onExitHandle = () => {
    modals.openConfirmModal({
      title: 'Confirm: Exit Comapny',
      children: <>All unsaved changes will be saved</>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: async () => {
        await saveFYChanges();
        router.push('/');
      },
    });
  };

  return {
    canSaveFY,
    onExitHandle,
    saveFYChanges,
  };
};

export const RNGNavLink: React.FC<{
  title: string;
  shortcut?: string;
  href?: string;
  onClick?: () => Promise<void> | void;
}> = ({ title, href, onClick, shortcut }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const router = useRouter();

  const onClickHanle = async () => {
    if (href) {
      router.push(href);
    }
    if (onClick) {
      await onClick();
    }
  };

  return (
    <RNGButton
      color={isActive ? 'blue' : 'gray'}
      onClick={async () => await onClickHanle()}
      shortcut={shortcut}
      size="compact-sm"
      className={'flex-shrink-0'}
    >
      {title}
    </RNGButton>
  );
};

export const FYTitle: React.FC = () => {
  const { baseUrl, company, fy } = useFYDerivedState();
  const router = useRouter();

  return (
    <>
      <Anchor
        onClick={() => router.push(baseUrl)}
        className="font-semibold"
        truncate
      >
        {company?.name}
      </Anchor>
      <Badge className="flex-shrink-0" color="blue" radius="xs" p={4}>
        F.Y.&nbsp;
        {fy?.startYear?.toString().substring(2, 4) +
          '-' +
          fy?.endYear?.toString().substring(2, 4)}
      </Badge>
    </>
  );
};
