'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  ButtonProps,
  Grid2Props,
  Typography,
  Unstable_Grid2,
} from '@mui/material';
import { FormHTMLAttributes, useEffect, useMemo } from 'react';
import type { UseFormProps as RHUseFormProps } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { RNGFormContext } from './0-context';
import { FormItem, renderFormItem } from './4-renderItems';
import { FormErrorHandler, OnSubmitResult } from './utils';

export interface RNGFormProps<Schema extends z.ZodTypeAny>
  extends Omit<
    FormHTMLAttributes<HTMLFormElement>,
    'name' | 'title' | 'onChange'
  > {
  name: string;
  schema: Schema;
  uiSchema: FormItem<Schema>[];
  defaultValues: RHUseFormProps<z.infer<Schema>>['defaultValues'];
  onSubmit?: (
    values: z.infer<Schema>
  ) => Promise<void | OnSubmitResult> | void | OnSubmitResult;
  onSuccess?: (values: z.infer<Schema>) => void | Promise<void>;
  onChange?: (values: z.infer<Schema>) => void;
  title?: string;
  description?: string;

  submitButton?: Omit<ButtonProps, 'children' | 'type'> & {
    label: string | React.ReactNode;
  };
  resetButton?: Omit<ButtonProps, 'children' | 'type'> & {
    label: string | React.ReactNode;
  };

  gridProps?: Partial<Grid2Props>;
}

export function RNGForm<Schema extends z.ZodTypeAny>({
  defaultValues,
  name,
  schema,
  description,
  onSubmit,
  resetButton,
  submitButton,
  title,
  className,
  uiSchema,
  onSuccess,
  gridProps,
  onChange,
  ...rest
}: RNGFormProps<Schema>) {
  const ctx = useForm<z.infer<Schema>>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const {
    clearErrors,
    setError,
    formState: { errors, isSubmitSuccessful },
    watch,
    reset,
  } = ctx;

  const watchingValues = watch();

  const onChangeHandler = useMemo(() => {
    if (onChange) {
      return () => onChange(watchingValues);
    } else return () => {};
  }, [watchingValues, onChange]);

  useEffect(() => {
    onChangeHandler();
  }, [onChangeHandler]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      clearErrors();
      reset();
    }
  }, [clearErrors, isSubmitSuccessful, reset]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <FormProvider {...ctx}>
      <RNGFormContext.Provider
        value={{
          formName: name,
          formData: watchingValues,
          initialValues: defaultValues,
          getItemId: (t: string) => name + t + '-id',
          getItemDescription: (itemValue, descFn) => {
            return descFn
              ? typeof descFn === 'string'
                ? descFn
                : descFn(itemValue, watchingValues)
              : '';
          },
        }}
      >
        <form
          noValidate
          autoComplete="off"
          onSubmit={ctx.handleSubmit(async (values) => {
            clearErrors();
            if (onSubmit) {
              const result: OnSubmitResult = await FormErrorHandler(
                async () => {
                  await onSubmit(values);
                  if (onSuccess) {
                    await onSuccess(values);
                  }
                  return { errors: false };
                }
              );

              if (result.errors !== false) {
                result.errors.map((item, index) => {
                  //@ts-expect-error safasd
                  return setError(item.path || `custom-${index}`, {
                    type: 'string',
                    message: item.message,
                  });
                });
              }
            }
          })}
          {...rest}
        >
          <Unstable_Grid2 container spacing={2} {...gridProps}>
            {!!(title || description) && (
              <Unstable_Grid2 xs={12} className="flex flex-col text-center">
                {title && <Typography variant="body1">{title}</Typography>}
                {description && (
                  <Typography variant="body2">{description}</Typography>
                )}
              </Unstable_Grid2>
            )}

            {Object.keys(errors).filter((item) => item.startsWith('custom'))
              .length > 0 &&
              Object.keys(errors)
                .filter((item) => item.startsWith('custom'))
                .map((item, i) => (
                  <Unstable_Grid2 xs={12} key={name + 'error' + item}>
                    <Alert severity="error">
                      {errors[item]?.message?.toString()}
                    </Alert>
                  </Unstable_Grid2>
                ))}

            {ctx.formState.isSubmitting && (
              <Unstable_Grid2 xs={12}>
                Loading...
                {/* <Loader color="blue" type="dots" className="mx-auto" /> */}
              </Unstable_Grid2>
            )}

            {uiSchema?.map((formItem, index) => {
              return renderFormItem(formItem, `${name}.${formItem.name}`);
            })}

            {(onSubmit || resetButton) && (
              <Unstable_Grid2 xs={12}>
                {resetButton && (
                  <Button type="reset" {...resetButton}>
                    {resetButton?.label || 'Reset'}
                  </Button>
                )}
                {!!onSubmit && (
                  <Button type="submit" variant="contained" {...submitButton}>
                    {submitButton?.label || 'Submit'}
                  </Button>
                )}
              </Unstable_Grid2>
            )}
          </Unstable_Grid2>
        </form>
      </RNGFormContext.Provider>
    </FormProvider>
  );
}
