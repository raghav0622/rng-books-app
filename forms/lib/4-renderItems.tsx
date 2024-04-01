'use client';

import { z } from 'zod';
import { RNGTextInput, RNGTextInputProps } from './3a-TextInput';

export type FormItem<Schema extends z.ZodTypeAny> = RNGTextInputProps<Schema>;
// | RNGPasswordInputProps<Schema>
// | RNGNumberInputProps<Schema>
// | RNGCurrencyInputProps<Schema>
// | RNGSwitchProps<Schema>
// | RNGAutocompleteBasicProps<Schema, any>
// | RNGAutocompleteCreatableProps<Schema>
// | RNGDateInputProps<Schema>
// | RNGHiddenInputProps<Schema>;

export function renderFormItem<Schema extends z.ZodTypeAny>(
  item: FormItem<Schema>,
  key: string
) {
  if (item.type === 'text') {
    return <RNGTextInput key={key} {...item} />;
  }
  // if (item.type === 'password') {
  //   return <RNGPasswordInput key={key} {...item} />;
  // }
  // if (item.type === 'number') {
  //   return <RNGNumberInput key={key} {...item} />;
  // }
  // if (item.type === 'currency') {
  //   return <RNGCurrencyInput key={key} {...item} />;
  // }

  // if (item.type === 'switch') {
  //   return <RNGSwitch key={key} {...item} />;
  // }
  // if (item.type === 'autocomplete-basic') {
  //   return <RNGAutocompleteBasic key={key} {...item} />;
  // }

  // if (item.type === 'autocomplete-creatable') {
  //   return <RNGAutocompleteCreatable key={key} {...item} />;
  // }
  // if (item.type === 'date') {
  //   return <RNGDateInput key={key} {...item} />;
  // }
  // if (item.type === 'hidden') {
  //   return <RNGHiddenInput key={key} {...item} />;
  // }

  return null;
}
