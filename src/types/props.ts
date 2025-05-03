/**
 * Created At: 2025-04-13:13:36:56
 * @author - @FL03
 * @file - props.ts
 */

import React from "react";

export type AsChildProps<T> = T & { asChild?: boolean }; 


export type BaseFormProps<T = any> = {
  asChild?: string;
  className?: string;
  key?: React.Key;
  id?: string;
  defaultValues?: Partial<T> | null;
  values?: Partial<T> | null;
  onCancel?: () => void;
  onSubmitError?: (error: Error) => void;
  onSubmitSuccess?: (values: Partial<T>) => void;
};

export type FormOverlayProps<T = any> = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  showLabel?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
} & BaseFormProps<T>;