'use client';

import { useGetDerived } from '@/state';
import {
  Alert,
  Group as MantineGroup,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { cn } from '@rng-apps/forms';
import { ClassValue } from 'clsx';
import React from 'react';
import ActionsGroup from '../Actions/Actions-Group';
import GroupDisplayEntry from './Group-Display-Entry';

const GroupDisplay: React.FC<{ groupId: string; className?: ClassValue }> = ({
  groupId,
  className,
}) => {
  const group = useGetDerived().getGroup(groupId);

  if (!group) return null;

  const groupBooks = group.childBooks.filter(
    (b) => b.id !== 'capital-from-previous-year'
  );
  const groupGroups = group.childGroups;

  const capitalCarry = group.childBooks.find(
    (b) => b.id === 'capital-from-previous-year'
  );

  const data = [capitalCarry, ...groupGroups, ...groupBooks];

  return (
    <Paper withBorder id={groupId} className={cn(className)}>
      <Stack gap="xs" p="sm">
        <MantineGroup wrap="nowrap" px="sm">
          <Text truncate className="font-bold">
            {group.name}
          </Text>
          <div className="ml-auto" />
          <ActionsGroup id={group.id} />
        </MantineGroup>

        {data.length > 0 && (
          <>
            {data.map(
              (d, index) =>
                !!d && (
                  <GroupDisplayEntry data={d} key={group.id + d.id + index} />
                )
            )}
          </>
        )}
        {data.length === 0 && !capitalCarry && (
          <Alert mx="xs">No Entries</Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default GroupDisplay;
