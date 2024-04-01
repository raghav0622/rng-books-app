'use client'; /* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloseButton,
  Combobox,
  TextInput,
  TextInputProps,
  useCombobox,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { z } from 'zod';
import { useRNGFormCtx } from './0-context';
import { BaseItem } from './1-common';
import { FieldWrapper } from './2-wrapper';

export type RNGAutocompleteCreatableProps<Schema extends z.ZodTypeAny> =
  BaseItem<Schema> & {
    type: 'autocomplete-creatable';
    options: string[];
    onCreate: (payload: string) => Promise<void> | void;
  } & Omit<
      TextInputProps,
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

export function RNGAutocompleteCreatable<Schema extends z.ZodTypeAny>({
  colProps,
  name,
  label,
  description,
  type,
  renderLogic,
  options,
  disabled,
  autoFocus,
  onCreate,
  valueOnNoRender,
  ...rest
}: RNGAutocompleteCreatableProps<Schema>) {
  const {
    field: { value: val, name: givenName, onChange, ref },
    fieldState: { error },
    formState: { isSubmitting, isSubmitSuccessful },
  } = useController({ name });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState('');

  const { getItemId, getItemDescription, initialValues } = useRNGFormCtx();

  const itemId = getItemId(name);
  const itemDescription = getItemDescription(val, description);

  const exactOptionMatch = options.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? options
    : options.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase().trim())
      );

  const optionsToDisplay = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));
  const initialValue = initialValues[name] || undefined;

  useEffect(() => {
    if (isSubmitSuccessful) {
      onChange(null);
      setSearch('');

      if (initialValue) {
        const optionSelected = options.find((opt) => opt === initialValue);
        if (optionSelected) {
          onChange(optionSelected);
          setSearch(optionSelected);
        }
      }
    }
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (initialValue) {
      const optionSelected = options.find((opt) => opt === initialValue);
      if (optionSelected) {
        onChange(optionSelected);
        setSearch(optionSelected);
      } else {
        onChange(null);
        setSearch('');
      }
    }
  }, []);

  useEffect(() => {
    if (options.length === 1) {
      setSearch(options[0]);
      onChange(options[0]);
    }
  }, [options]);

  return (
    <FieldWrapper
      fieldValue={val}
      fieldId={itemId}
      name={givenName}
      renderLogic={renderLogic}
      onChangeController={onChange}
      colProps={colProps}
      valueOnNoRender={valueOnNoRender}
      autoFocus={autoFocus}
    >
      <Combobox
        store={combobox}
        withinPortal={false}
        onOptionSubmit={async (val) => {
          if (val === '$create') {
            await onCreate(search);
            onChange(search);
          } else {
            setSearch(val);
            onChange(val);
          }
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <TextInput
            label={label}
            description={itemDescription}
            error={error?.message}
            value={search}
            onChange={(event) => {
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
              setSearch(event.currentTarget.value);
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => {
              combobox.closeDropdown();
              setSearch(val || '');
            }}
            ref={ref}
            id={itemId}
            name={givenName}
            disabled={isSubmitting || disabled}
            data-autofocus={autoFocus}
            autoFocus={autoFocus}
            {...rest}
            rightSection={
              disabled ? null : val !== null ? (
                <CloseButton
                  size="sm"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setSearch('');
                    onChange(undefined);
                  }}
                  aria-label="Clear value"
                />
              ) : (
                <Combobox.Chevron />
              )
            }
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {optionsToDisplay}
            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">
                + Create {search}
              </Combobox.Option>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </FieldWrapper>
  );
}
