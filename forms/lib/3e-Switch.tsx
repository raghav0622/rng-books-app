'use client';
import {
  Checkbox,
  Stack,
  SwitchProps,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { useRNGFormCtx } from './0-context';
import { BaseItem } from './1-common';
import { FieldWrapper } from './2-wrapper';
import classes from './3e-css.module.css';

type BaseSwitchProps = { type: 'switch' } & Omit<
  SwitchProps,
  | 'description'
  | 'error'
  | 'inputContainer'
  | 'withErrorStyles'
  | 'wrapperProps'
  | 'onChange'
  | 'name'
  | 'value'
  | 'id'
  | 'ref'
  | 'error'
  | 'type'
  | 'className'
  | 'checked'
  | 'defaultChecked'
>;

export type RNGSwitchProps<Schema extends z.ZodTypeAny> = BaseItem<Schema> &
  BaseSwitchProps;

export function RNGSwitch<Schema extends z.ZodTypeAny>({
  colProps,
  name,
  label,
  description,
  type,
  renderLogic,
  disabled,
  autoFocus,
  valueOnNoRender,
  ...rest
}: RNGSwitchProps<Schema>) {
  const {
    field: { value, name: givenName, onChange, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name });

  const { getItemId, getItemDescription } = useRNGFormCtx();

  const itemId = getItemId(name);
  const itemDescription = getItemDescription(value, description);

  return (
    <FieldWrapper
      fieldValue={value}
      fieldId={itemId}
      name={givenName}
      renderLogic={renderLogic}
      onChangeController={onChange}
      colProps={colProps}
      autoFocus={autoFocus}
      valueOnNoRender={valueOnNoRender}
    >
      <Stack gap={0}>
        <UnstyledButton
          ref={ref}
          onClick={() => onChange(!value)}
          className={classes.button}
          id={itemId}
          disabled={isSubmitting || disabled}
          data-autofocus={autoFocus}
          autoFocus={autoFocus}
          name={givenName}
        >
          <Checkbox
            checked={value || false}
            onChange={() => {}}
            tabIndex={-1}
            mr="sm"
            styles={{ input: { cursor: 'pointer' } }}
            aria-hidden
          />
          <Text fw={500} lh={1} fz="sm">
            {label}
          </Text>
        </UnstyledButton>

        {itemDescription === '' ? null : (
          <Text fz="xs" c="dimmed">
            {itemDescription}
          </Text>
        )}
        {error?.message && (
          <Text fz="xs" c="red">
            {itemDescription}
          </Text>
        )}
      </Stack>
    </FieldWrapper>
  );
}
