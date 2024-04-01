'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
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

type BaseAutocompleteProps<Option extends Record<string, any>> = {
  type: 'autocomplete-basic';
  options: Option[];
  getOptionLabel: (opt: Option) => string;
  // isOptEqualToVal: (opt: Option, next: Option) => boolean;
  getOptionValue?: (opt: Option) => unknown;
  groupBy?: keyof Option;
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

export type RNGAutocompleteBasicProps<
  Schema extends z.ZodTypeAny,
  Option extends Record<string, any>
> = BaseItem<Schema> & BaseAutocompleteProps<Option>;

export function RNGAutocompleteBasic<
  Schema extends z.ZodTypeAny,
  Option extends Record<string, any>
>({
  colProps,
  name,
  label,
  description,
  type,
  renderLogic,
  options,
  getOptionLabel,
  getOptionValue = (t) => t,
  disabled,
  autoFocus,
  valueOnNoRender,
  groupBy,
  ...rest
}: RNGAutocompleteBasicProps<Schema, Option>) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const {
    field: { value: val, name: givenName, onChange, ref },
    fieldState: { error },
    formState: { isSubmitting, isSubmitSuccessful },
  } = useController({ name });

  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { getItemId, getItemDescription, initialValues } = useRNGFormCtx();

  const initialValue = initialValues[name] || undefined;

  const itemId = getItemId(name);
  const itemDescription = getItemDescription(val, description);

  const shouldFilterOptions = options.every(
    (item) => getOptionLabel(item) !== search
  );

  const filteredOptions = shouldFilterOptions
    ? options.filter((item) =>
        getOptionLabel(item)
          .toLowerCase()
          .includes(search?.toLowerCase().trim())
      )
    : options;

  const optionsToDisplay = filteredOptions.map((item: Option, index) => (
    <Combobox.Option
      value={JSON.stringify(item)}
      key={itemId + 'option' + index}
    >
      {getOptionLabel(item)}
    </Combobox.Option>
  ));

  const groupOptions = () => {
    if (!groupBy) {
      return options.map((item: Option, index) => (
        <Combobox.Option
          value={JSON.stringify(item)}
          key={itemId + 'option' + index}
        >
          {getOptionLabel(item)}
        </Combobox.Option>
      ));
    }

    const groupedOptions: { [key: string]: Option[] } = {};
    options.forEach((item: Option) => {
      const groupValue = item[groupBy];
      if (!groupedOptions[groupValue]) {
        groupedOptions[groupValue] = [];
      }
      groupedOptions[groupValue].push(item);
    });

    return Object.entries(groupedOptions).map(([group, groupItems], index) => (
      <Combobox.Group label={group} key={group + index}>
        {groupItems.map((item: Option, idx) => (
          <Combobox.Option
            value={JSON.stringify(item)}
            key={itemId + 'option' + idx}
          >
            {getOptionLabel(item)}
          </Combobox.Option>
        ))}
      </Combobox.Group>
    ));
  };

  useEffect(() => {
    if (selected) {
      const data = JSON.parse(selected);
      setSearch(getOptionLabel(data));
      onChange(getOptionValue(data));
    } else {
      setSearch('');
      onChange(undefined);
    }
  }, [getOptionLabel, getOptionValue, onChange, selected]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setSelected(null);

      if (initialValue) {
        const optionSelected = options.find(
          (opt) => getOptionValue(opt) === initialValue
        );
        if (optionSelected) {
          setSelected(JSON.stringify(optionSelected));
        } else {
          setSelected(null);
        }
      }
    }
  }, [getOptionValue, initialValue, isSubmitSuccessful, options]);

  useEffect(() => {
    if (initialValue) {
      const optionSelected = options.find(
        (opt) => getOptionValue(opt) === initialValue
      );
      if (optionSelected) setSelected(JSON.stringify(optionSelected));
      else setSelected(null);
    }
  }, [getOptionValue, initialValue, options]);

  useEffect(() => {
    if (options.length === 1) setSelected(JSON.stringify(options[0]));
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
        classNames={{
          dropdown: 'shadow-2xl border-blue-400',
          option: 'hover:bg-blue-300 hover:text-blue-900',
        }}
        onOptionSubmit={(val) => {
          setSelected(val);
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
            }}
            ref={ref}
            id={itemId}
            name={givenName}
            disabled={isSubmitting || disabled}
            data-autofocus={autoFocus}
            autoFocus={autoFocus}
            {...rest}
            rightSection={
              disabled ? null : selected !== null ? (
                <CloseButton
                  size="sm"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setSelected(null);
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
            {optionsToDisplay.length > 0 ? (
              groupOptions() // Render grouped options
            ) : (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </FieldWrapper>
  );
}
