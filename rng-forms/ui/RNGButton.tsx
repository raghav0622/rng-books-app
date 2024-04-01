'use client';

import { Button, ButtonProps, Tooltip } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import React, { forwardRef } from 'react';
import { useDevice } from './useDevice';
type RNGButtonPrpos = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<'button'> &
    ButtonProps & {
      tooltip?: string;
      visible?: boolean;
      shortcut?: string;
    }
>;
export const RNGButton = forwardRef<HTMLButtonElement, RNGButtonPrpos>(
  ({ tooltip: baseTip, shortcut, children, visible = true, ...rest }, ref) => {
    const { isExternalKeyboardActive } = useDevice();

    const tooltip =
      isExternalKeyboardActive && shortcut !== undefined
        ? baseTip
          ? baseTip + ' (' + shortcut + ')'
          : shortcut
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
      <Button ref={ref} variant="outline" size="compact-xs" {...rest}>
        {children}
      </Button>
    );

    if (visible) return tooltip !== undefined ? withTooltip(content) : content;

    return null;
  }
);
