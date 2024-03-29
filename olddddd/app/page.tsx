'use client';

import { ScrollArea, Stack } from '@mantine/core';
import { SlotContent, SlotView, useDevice } from '@rng-apps/forms';

import CompaniesList from '@/components/Company/Company-List';
import CompanyNewModal from '@/drawers/Drawer-Company-Create';

export default function Index() {
  const { isLg, isLandscape } = useDevice();
  return (
    <ScrollArea className="w-full">
      <Stack className="max-w-sm mx-auto" gap="sm" p="sm">
        <SlotContent
          name={isLg || isLandscape ? 'appbar-right-actions' : 'page-default'}
        >
          <CompanyNewModal />
        </SlotContent>
        <SlotView name="page-default" />
        <CompaniesList />
      </Stack>
    </ScrollArea>
  );
}
