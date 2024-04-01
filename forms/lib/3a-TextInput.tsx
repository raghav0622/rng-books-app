'use client';
import { TextField, TextFieldProps } from '@mui/material';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { useRNGFormCtx } from './0-context';
import { BaseItem } from './1-common';
import { FieldWrapper } from './2-wrapper';

type BaseTextInputProps = { type: 'text' } & Omit<
  TextFieldProps,
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
>;

export type RNGTextInputProps<Schema extends z.ZodTypeAny> = BaseItem<Schema> &
  BaseTextInputProps;

export function RNGTextInput<Schema extends z.ZodTypeAny>({
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
}: RNGTextInputProps<Schema>) {
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
      <TextField
        label={label}
        helperText={error?.message ?? itemDescription}
        error={Boolean(error?.message)}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        value={value || ''}
        id={itemId}
        name={givenName}
        disabled={isSubmitting || disabled}
        autoFocus={autoFocus}
        fullWidth
        {...rest}
      />
    </FieldWrapper>
  );
}
