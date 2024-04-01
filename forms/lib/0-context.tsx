'use client';

import { createContext, useContext } from 'react';
import type { UseFormProps as RHUseFormProps } from 'react-hook-form';
import { z } from 'zod';

export type RNGFormContextType<Schema extends z.ZodTypeAny> = {
  formName: string;
  formData: RHUseFormProps<z.infer<Schema>>['defaultValues'];
  initialValues: RHUseFormProps<z.infer<Schema>>['values'];
  getItemId: (name: string) => string;
  getItemDescription: (
    itemValue: unknown,
    descFn?:
      | ((
          fieldValue: unknown,
          formData: z.infer<Schema>
        ) => string | React.ReactNode)
      | string
  ) => string | React.ReactNode;
};

export const RNGFormContext = createContext<
  RNGFormContextType<any> | undefined
>(undefined);

export const useRNGFormCtx = () => {
  const val = useContext(RNGFormContext);

  if (!val) throw new Error('ghar ka raj hai kya?');

  return val;
};
