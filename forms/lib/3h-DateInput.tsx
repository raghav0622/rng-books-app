'use client';
import { DateInput, DateInputProps } from '@mantine/dates';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { useRNGFormCtx } from './0-context';
import { BaseItem } from './1-common';
import { FieldWrapper } from './2-wrapper';

type BaseDateInputProps = { type: 'date' } & Omit<
  DateInputProps,
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

export type RNGDateInputProps<Schema extends z.ZodTypeAny> = BaseItem<Schema> &
  BaseDateInputProps;

export function RNGDateInput<Schema extends z.ZodTypeAny>({
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
}: RNGDateInputProps<Schema>) {
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
      <DateInput
        label={label}
        description={itemDescription}
        error={error?.message}
        onChange={(e) => onChange(e)}
        ref={ref}
        value={value}
        valueFormat="MM/DD/YYYY"
        placeholder="MM/DD/YYYY"
        id={itemId}
        name={givenName}
        disabled={isSubmitting || disabled}
        data-autofocus={autoFocus}
        autoFocus={autoFocus}
        {...rest}
      />
    </FieldWrapper>
  );
}
