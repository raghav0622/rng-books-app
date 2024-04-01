'use client';
import { Grid2Props } from '@mui/material';
import type { Path } from 'react-hook-form';
import { z } from 'zod';

export type BaseItem<Schema extends z.ZodTypeAny> = {
  name: Path<z.infer<Schema>>;
  label: string;
  type:
    | 'text'
    | 'password'
    | 'number'
    | 'currency'
    | 'switch'
    | 'autocomplete-basic'
    | 'autocomplete-creatable'
    | 'date';
  colProps?: Partial<Omit<Grid2Props, 'container'>>;
  description?:
    | ((
        fieldValue: unknown,
        formData: z.infer<Schema>
      ) => string | React.ReactNode)
    | string;

  renderLogic?: (formData: z.infer<Schema>) => Promise<boolean> | boolean;

  valueOnNoRender?: (formData: z.infer<Schema>) => unknown;
};

export type FieldWrapperProps<Schema extends z.ZodTypeAny> = Omit<
  BaseItem<Schema>,
  'label' | 'type' | 'description'
> & {
  fieldId: string;
  fieldValue: unknown;
  onChangeController: (e: unknown) => void;
  children: React.ReactNode;
  autoFocus?: boolean;
};

// export type RNGCreateOptionProps<Option> = {
//   getOptionLabel: (option: Option) => string;
//   optionModifier: (option: Option) => unknown;
//   isOptionEqualToValue: (option: Option, value: Option) => boolean;
// };
