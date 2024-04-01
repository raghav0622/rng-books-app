'use client';
import { NumberInput, NumberInputProps } from '@mantine/core';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { useRNGFormCtx } from './0-context';
import { BaseItem } from './1-common';
import { FieldWrapper } from './2-wrapper';

type BaseNumberInputProps = { type: 'number' } & Omit<
  NumberInputProps,
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
  | 'inputMode'
>;

export type RNGNumberInputProps<Schema extends z.ZodTypeAny> =
  BaseItem<Schema> & BaseNumberInputProps;

export function RNGNumberInput<Schema extends z.ZodTypeAny>({
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
}: RNGNumberInputProps<Schema>) {
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
      valueOnNoRender={valueOnNoRender}
      autoFocus={autoFocus}
    >
      <NumberInput
        label={label}
        description={itemDescription}
        error={error?.message}
        onChange={(e) => onChange(e)}
        ref={ref}
        inputMode="numeric"
        value={`${value || ''}`}
        autoFocus={autoFocus}
        id={itemId}
        name={givenName}
        disabled={isSubmitting || disabled}
        data-autofocus={autoFocus}
        hideControls
        {...rest}
      />
    </FieldWrapper>
  );
}
