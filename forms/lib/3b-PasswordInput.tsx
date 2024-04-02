'use client';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { useRNGFormCtx } from './0-context';
import { BaseItem } from './1-common';
import { FieldWrapper } from './2-wrapper';

type BasePasswordInputProps = { type: 'password' } & Omit<
  PasswordInputProps,
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

export type RNGPasswordInputProps<Schema extends z.ZodTypeAny> =
  BaseItem<Schema> & BasePasswordInputProps;

export function RNGPasswordInput<Schema extends z.ZodTypeAny>({
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
}: RNGPasswordInputProps<Schema>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
      <PasswordInput
        label={label}
        description={itemDescription}
        error={error?.message}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        value={value || ''}
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
