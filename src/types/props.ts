/**
 * Created At: 2025-04-13:13:36:56
 * @author - @FL03
 * @file - props.ts
 */

import React from "react";

export type AsChild = { asChild?: boolean };

/** A simple type literal for the four sides of a 2-dimensional surface; i.e. left, right, top, bottom. */
export type LRTB = 'left' | 'right' | 'top' | 'bottom';

export type PropsWithDescription = {
  description?: React.ReactNode;
}

export type PropsWithTitle = {
  title?: React.ReactNode;
}

export type PropsWithSides = {
  side?: LRTB;
}

export type HeaderProps = PropsWithTitle & PropsWithDescription;

/** 
 * This type defines a standard interface for implemented forms. It provides access to various methods that enable users to have 
 * granular external control over the form and its behaviours. 
 */
export type FormConfig<TForm = unknown> = {
  defaultValues?: Partial<TForm>;
  values?: TForm;
  onCancel?: () => void;
  onError?: React.Dispatch<any>;
  onSubmit?: React.Dispatch<TForm>;
  onSubmitSuccess?: React.Dispatch<TForm>;
} & AsChild;

export type StandardFormProps<TData = unknown> = FormConfig<TData> & Omit<React.ComponentPropsWithRef<'form'>, 'children' | 'title' | 'onSubmit'>

type BaseModalProps = {
  asChild?: boolean;
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: React.Dispatch<boolean>;
  onCancel?: () => void;
} 

export type ModalProps<TForm = unknown> = BaseModalProps & FormConfig<TForm>;

export type ModalPropsWithSides<TForm = unknown> = BaseModalProps & FormConfig<TForm> & { side?: LRTB };

export type ModalWithTriggerProps<TForm = unknown> = {
  showLabel?: boolean;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
} & ModalProps<TForm>;