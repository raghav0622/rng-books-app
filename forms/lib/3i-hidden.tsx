'use client';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { BaseItem } from './1-common';

type BaseHiddenInputProps = { type: 'hidden' };

export type RNGHiddenInputProps<Schema extends z.ZodTypeAny> = Pick<
  BaseItem<Schema>,
  'name'
> &
  BaseHiddenInputProps;

export function RNGHiddenInput<Schema extends z.ZodTypeAny>({
  name,
}: RNGHiddenInputProps<Schema>) {
  const {
    field: { value, name: givenName },
  } = useController({ name });

  return <input type="hidden" name={givenName} value={value} />;
}
