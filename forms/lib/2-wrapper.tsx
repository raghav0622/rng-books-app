'use client';
import { Unstable_Grid2 as Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useRNGFormCtx } from './0-context';
import { FieldWrapperProps } from './1-common';

export function FieldWrapper<Schema extends z.ZodTypeAny>({
  children,
  name: fieldName,
  renderLogic,
  fieldId,
  onChangeController: onChange,
  colProps,
  valueOnNoRender = undefined,
  autoFocus = false,
  fieldValue,
}: FieldWrapperProps<Schema>) {
  const [render, setRender] = useState(true);

  const { formData, initialValues } = useRNGFormCtx();

  const initialValue = initialValues[fieldName];
  const valueOnNoRenderVal = useMemo(
    () =>
      valueOnNoRender && !render ? valueOnNoRender(formData) : initialValue,
    [formData, valueOnNoRender, render, initialValue]
  );

  const {
    setFocus,
    formState: { isSubmitSuccessful },
    resetField,
  } = useFormContext();

  //autofocus on submit successfull
  useEffect(() => {
    if (isSubmitSuccessful) {
      resetField(fieldName, {
        keepDirty: false,
        keepError: false,
        keepTouched: false,
      });

      if (autoFocus) {
        setFocus(fieldName);
      }
    }
  }, [autoFocus, fieldName, isSubmitSuccessful, resetField, setFocus]);

  //handle value on render change
  useEffect(() => {
    onChange(valueOnNoRenderVal);
  }, [valueOnNoRenderVal, onChange]);

  useEffect(() => {
    if (renderLogic) {
      void (async function () {
        try {
          const result = await renderLogic(formData);
          setRender(result);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [renderLogic, formData]);

  if (!render)
    return (
      //@ts-expect-error fasfsfafas
      <input type="hidden" value={fieldValue} name={fieldName} id={fieldId} />
    );

  return (
    <Grid xs={12} {...colProps}>
      {children}
    </Grid>
  );
}
