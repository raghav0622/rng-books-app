'use client';
import { useFYState } from '@/_schema';
import { Divider, Group, ScrollArea } from '@mantine/core';
import { RNGButton, SlotContent, useDevice } from '@rng-apps/forms';
import DrawerBookCreate from '../Drawers/Drawer-Book-Create';
import DrawerAddGroup from '../Drawers/Drawer-Group-Add';
import DrawerTransactionCreate from '../Drawers/Drawer-Transaction-Create';
import { FYTitle, RNGNavLink, useFYCommonActions } from './common';

const LayoutHeader: React.FC = () => {
  const { baseUrl } = useFYState();
  const { onExitHandle, saveFYChanges, canSaveFY } = useFYCommonActions();
  const { isDesktop } = useDevice();

  const linkSet1 = (
    <>
      <RNGNavLink href={baseUrl} title="Dashboard" shortcut="Ctrl+1" />
      <RNGNavLink href={baseUrl + '/report'} title="Report" shortcut="Ctrl+2" />
    </>
  );
  const linkSet3 = (
    <>
      <DrawerTransactionCreate
        trigger={(open) => (
          <RNGButton
            color="gray"
            className={'flex-shrink-0'}
            size="compact-sm"
            onClick={open}
            shortcut="Ctrl+3"
          >
            Create Transaction
          </RNGButton>
        )}
      />
      <DrawerBookCreate
        trigger={(open) => (
          <RNGButton
            color="gray"
            className={'flex-shrink-0'}
            size="compact-sm"
            onClick={open}
            shortcut="Ctrl+4"
          >
            Create Book
          </RNGButton>
        )}
      />
      <DrawerAddGroup
        trigger={(open) => (
          <RNGButton
            color="gray"
            className={'flex-shrink-0'}
            size="compact-sm"
            onClick={open}
            shortcut="Ctrl+5"
          >
            Create Group
          </RNGButton>
        )}
      />
    </>
  );
  const linkSet2 = (
    <>
      <RNGButton
        size="compact-sm"
        color="blue"
        shortcut="Ctrl+S"
        className="flex-shrink-0"
        onClick={async () => {
          await saveFYChanges();
        }}
        visible={canSaveFY}
      >
        Save
      </RNGButton>
      <RNGButton
        size="compact-sm"
        className="flex-shrink-0"
        color="red"
        onClick={onExitHandle}
        shortcut="Ctrl+Q"
      >
        Exit
      </RNGButton>
    </>
  );

  return (
    <>
      <SlotContent name="appbar-middle-toolbar">
        <Divider orientation="vertical" />
        <FYTitle />
        {isDesktop ? (
          <>
            <Divider orientation="vertical" />
            {linkSet1} {linkSet3}
            <div className="ml-auto" />
            {linkSet2}
          </>
        ) : (
          <div className="ml-auto" />
        )}
      </SlotContent>
      {!isDesktop && (
        <>
          <ScrollArea scrollbars="x" offsetScrollbars scrollbarSize={4}>
            <Group pt="sm" py="md" px="sm" wrap="nowrap" gap="xs">
              {linkSet1} {linkSet2} {linkSet3}
            </Group>
          </ScrollArea>
          <Divider />
        </>
      )}
    </>
  );
};

export default LayoutHeader;
