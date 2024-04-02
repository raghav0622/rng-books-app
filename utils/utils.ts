'use client';
// export function createOptionsProps<Option>(
//   options: Option[],
//   props: RNGCreateOptionProps<Option>
// ) {
//   return {
//     options,
//     ...props,
//   };
// }

import { clsx, type ClassValue } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { ToWords } from 'to-words';

import { z } from 'zod';

export class FormError extends Error {
  constructor(message: string, path?: string) {
    super(message);
    this.name = path ?? '';
  }
}

export type ErrorArray = Array<{
  message: string;
  path?: string;
}>;

export type OnSubmitResult = {
  errors: false | ErrorArray;
};

export async function FormErrorHandler(fn: () => Promise<OnSubmitResult>) {
  try {
    const result = await fn();
    return result;
  } catch (err) {
    if (err instanceof FormError) {
      return {
        errors: [{ message: err.message, path: err.name }],
      };
    } else {
      return {
        //@ts-expect-error ghar ka raj hai
        errors: [{ message: err?.message }],
      };
    }
  }
}

export const cn = function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  ) as React.ReactElement[];
}

export const logicalRender = (
  logic: boolean,
  content: React.ReactNode
): React.ReactNode => {
  return logic ? content : null;
};

export async function cleanUndefined<T>(input: T): Promise<T> {
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  if (Array.isArray(input)) {
    const cleanedArray = await Promise.all(
      input.map(async (item) => cleanUndefined(item))
    );
    return cleanedArray as T;
  }

  const obj = { ...input } as Record<string, any>;

  await Promise.all(
    Object.keys(obj).map(async (key) => {
      const value = obj[key];

      if (value === undefined) {
        obj[key] = null;
      } else if (value instanceof Date) {
        // Handle Date objects differently, e.g., convert to string or clone
        // Modify this part based on your specific requirements for handling Date objects
        obj[key] = new Date(value);
      } else if (typeof value === 'object' && value !== null) {
        obj[key] = await cleanUndefined(value);
      }
    })
  );

  return obj as T;
}

export const string = z.string().min(1);

export const optionalString = string
  .nullable()
  .optional()
  .or(z.literal('').transform(() => null))
  .or(z.literal(undefined).transform(() => null));

export const date = z.date();

export const dateOptional = z
  .date()
  .nullable()
  .optional()
  .or(z.literal('').transform(() => null))
  .or(z.literal(undefined).transform(() => null));

export const boolean = z
  .boolean()
  .transform((t) => (t ? true : false))
  .or(z.literal(undefined).transform(() => false));

export const booleanInput = z
  .boolean()
  .transform((t) => (t ? true : false))
  .nullable()
  .optional()
  .or(z.literal('').transform(() => null))
  .or(z.literal(undefined).transform(() => null));

export const number = z.preprocess(
  (args) => (args === '' ? null : args),
  z.coerce.number()
);

export const numberOptional = z
  .preprocess((args) => (args === '' ? null : args), z.coerce.number())
  .nullable()
  .optional()
  .or(z.literal('').transform(() => null))
  .or(z.literal(undefined).transform(() => null));

export const numberPositive = number.refine(
  (val) => val >= 0,
  'Positive Number only'
);

export const numberNegative = number.refine(
  (val) => val <= 0,
  'Negative Number only'
);

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim());

export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim());

export const currency = (num: number, withPostfix?: boolean) => {
  const postfix = withPostfix ? (num < 0 ? 'DR' : 'CR') : '';

  return `${new Intl.NumberFormat('en-in', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'never',
  }).format(num)} ${postfix}`;
};

export const fireDate = (date: Date | Timestamp): Date => {
  const isDate = date instanceof Date;

  if (isDate) return dayjs(date).toDate();

  return dayjs(
    new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
  ).toDate();
};

export const fireDateString = (date: Date | Timestamp) => {
  return dayjs(fireDate(date)).format('DD-MM-YYYY').toString();
};

export const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    let fileInfo;
    let baseURL = '';
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      //@ts-expect-error dfaf
      baseURL = reader.result;

      resolve(baseURL);
    };
  });
};

export const createSelectOptionFromArrayOfString = (payload: string[]) => {
  return [
    ...payload.map((str) => ({
      label: str,
      value: str,
    })),
  ];
};
export const toIndianCurrency = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
});

export const spellIndianCurrency = (number: number) =>
  isNaN(number) || !number ? '' : toIndianCurrency.convert(number);
