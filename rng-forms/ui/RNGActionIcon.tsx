'use client';
import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import React, { forwardRef } from 'react';
import { useDevice } from './useDevice';

type RNGActionIconProps = React.ComponentPropsWithoutRef<'button'> &
  ActionIconProps & {
    tooltip?: string;
    visible?: boolean;
    shortcut?: string;
  };

export const RNGActionIcon = forwardRef<HTMLButtonElement, RNGActionIconProps>(
  ({ tooltip: baseTip, shortcut, children, visible = true, ...rest }, ref) => {
    const { isExternalKeyboardActive } = useDevice();

    const tooltip =
      isExternalKeyboardActive && shortcut !== undefined
        ? baseTip
          ? baseTip + ' (' + shortcut + ')'
          : '(' + shortcut + ')'
        : baseTip;

    const withTooltip = (content: React.ReactNode) => (
      <Tooltip label={tooltip}>{content}</Tooltip>
    );

    useHotkeys([
      [
        shortcut || '',
        async (e) => {
          if (isExternalKeyboardActive || !rest.disabled) {
            e.preventDefault();
            if (rest.onClick && shortcut && visible) {
              //@ts-expect-error dsfads
              await rest.onClick();
            }
          }
        },
      ],
    ]);

    const content = (
      <ActionIcon
        ref={ref}
        classNames={{
          icon: '[&>svg]:!h-[70%] [&>svg]:!w-[70%]',
        }}
        radius="xl"
        size="md"
        variant="light"
        {...rest}
      >
        {children}
      </ActionIcon>
    );

    if (visible) return tooltip !== undefined ? withTooltip(content) : content;

    return null;
  }
);
