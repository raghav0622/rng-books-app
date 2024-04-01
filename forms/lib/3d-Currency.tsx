'use client';
import { ActionIcon, NumberInput } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { spellIndianCurrency } from '../utils';
import { useRNGFormCtx } from './0-context';
import { BaseItem } from './1-common';
import { FieldWrapper } from './2-wrapper';

type BaseCurrencyInputProps = {
  type: 'currency';
  positveValueOnly?: boolean;
  negativeValueOnly?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
};

export type RNGCurrencyInputProps<Schema extends z.ZodTypeAny> =
  BaseItem<Schema> & BaseCurrencyInputProps;

export function RNGCurrencyInput<Schema extends z.ZodTypeAny>({
  colProps,
  name,
  label,
  description,
  type,
  renderLogic,
  disabled,
  autoFocus,
  positveValueOnly,
  negativeValueOnly,
  valueOnNoRender,
}: RNGCurrencyInputProps<Schema>) {
  if (positveValueOnly && negativeValueOnly)
    throw new Error('Both positive & negative value only cannot be passed');

  const {
    field: { value, name: givenName, onChange, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name });

  const [numVal, setNumVal] = useState<string | number>(Math.abs(value) || '');
  const [cr, setCr] = useState(
    value === undefined ? true : value >= 0 ? true : false
  );

  const { getItemId, getItemDescription } = useRNGFormCtx();

  const itemId = getItemId(name);
  const itemDescription = getItemDescription(value, description);
  const spelled =
    value && value !== 0
      ? `${cr ? 'Credit' : 'Debit'} ${spellIndianCurrency(Math.abs(value))}`
      : '';

  useHotkeys([
    [
      '*',
      (e) => {
        if (
          document.activeElement?.id === itemId &&
          !positveValueOnly &&
          !negativeValueOnly
        ) {
          if (e.key === '-') {
            e.preventDefault();
            setCr(false);
          }
          if (e.key === '+') {
            e.preventDefault();
            setCr(true);
          }
        }
      },
    ],
  ]);

  useEffect(() => {
    if (positveValueOnly) setCr(true);
    if (negativeValueOnly) setCr(false);
  }, [positveValueOnly, negativeValueOnly]);

  useEffect(() => {
    const num = Number(numVal);
    if (!isNaN(num)) {
      if (!cr) onChange(num * -1);
      else onChange(num);
    } else {
      onChange(0);
      setNumVal(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numVal, cr]);

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
      <NumberInput
        label={label}
        description={
          itemDescription === '' ? (
            spelled
          ) : (
            <>
              {itemDescription} <br /> {spelled}
            </>
          )
        }
        error={error?.message}
        onChange={(e) => setNumVal(e || 0)}
        allowLeadingZeros={true}
        ref={ref}
        min={0}
        value={value ? `${Math.abs(value)}` : 0}
        id={itemId}
        name={givenName}
        disabled={isSubmitting || disabled}
        data-autofocus={autoFocus}
        inputMode="decimal"
        autoFocus={autoFocus}
        hideControls
        prefix="₹ "
        allowDecimal={true}
        decimalScale={2}
        thousandSeparator=","
        thousandsGroupStyle="lakh"
        allowNegative={false}
        rightSection={
          <ActionIcon
            color={cr ? 'green' : 'red'}
            radius="xl"
            onClick={() => setCr((prev) => !prev)}
            style={{ fontSize: '75%', marginRight: 12 }}
            disabled={positveValueOnly || negativeValueOnly}
          >
            {cr ? 'CR' : 'DR'}
          </ActionIcon>
        }
      />
    </FieldWrapper>
  );
}
