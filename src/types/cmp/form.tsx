/**
 * Created At: 2025.09.30:14:14:28
 * @author - @FL03
 * @directory - src/types/props
 * @file - form.tsx
 */
import React from "react";

type RawFormProps<TData> = {
  className?: string;
  defaultValues?: Partial<TData>;
  values?: TData;
  onCancel?(): void;
  onError?(error: unknown): void;
  onSuccess?(): void;
};
/**
 * The `PropsWithForm` object allows for the composition of other types, injecting only the necessary fields into the defined type.
 * @param T - Additional props to include.
 * @param TData - The shape of the form data.
 */
export type PropsWithForm<T, TData> = T & RawFormProps<TData>;

/**
 * The `FormProps` type defines the props for a form component, extending standard HTML form attributes while omitting
 * certain fields to avoid conflicts; use this type for directly typing form components.
 */
export type FormProps<TData, T = {}> = PropsWithForm<
  Omit<
    React.ComponentPropsWithRef<"form">,
    "action" | "children" | "id" | "method" | "onSubmit" | "title"
  > & T,
  TData
>;
