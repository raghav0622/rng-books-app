'use client';

import { ScrollArea, ScrollAreaProps, Stack, StackProps } from '@mantine/core';
import { cn } from '@rng-apps/forms';
import React, { PropsWithChildren } from 'react';

const PageContent: React.FC<
  PropsWithChildren<
    ScrollAreaProps & {
      stackProps?: StackProps;
    }
  >
> = ({
  children,
  className = 'flex-grow h-full',
  scrollbars = 'y',
  classNames = {
    viewport: '[&>div]:!block',
  },
  stackProps,
  ...rest
}) => {
  return (
    <ScrollArea
      className={cn('relative', className)}
      scrollbars={scrollbars}
      classNames={classNames}
      {...rest}
    >
      <Stack p="sm" className="relative" {...stackProps}>
        {children}
      </Stack>
    </ScrollArea>
  );
};

export default PageContent;
