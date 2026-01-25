/**
 * Created At: 2025.11.21:14:14:51
 * @author - @FL03
 * @directory - src/types
 * @file - widgets.tsx
 */
import { ReactNode } from "react";
import { ClassNames } from "@pzzld/core";
// components
import { Button } from "@/components/ui/button";

/** A type defining binary string variants of `left` or `right`. */
export type SideX = "left" | "right";
/** A type defining binary string variants of `top` or `bottom`. */
export type SideY = "top" | "bottom";
/** A simple type literal for the four sides of a 2-dimensional surface; i.e. left, right, top, bottom. */
export type LRTB = SideX | SideY;

/** A composable type for extending the inner type with an optional `asChild` boolean field. */
export type PropsAsChild<TInner = {}> = TInner & { asChild?: boolean };

export type PropsWithNamedChildren<T = {}, TKeys extends string = "children"> =
  & T
  & { [K in TKeys]?: ReactNode };

/** A type wrapper injecting the current context with an optional description field. */
export type PropsWithDescription<T = {}> =
  & T
  & PropsWithNamedChildren<{ showDescription?: boolean }, "description">;
/** A type wrapper injecting the current context with an optional `title` child. */
export type PropsWithTitle<T = {}> = PropsWithNamedChildren<T, "title">;

export type PropsWithSide<T> = T & {
  side?: LRTB;
};

export type ComponentPropsWithHeader<T = {}> =
  & T
  & {
    description?: ReactNode;
    title?: ReactNode;
    classNames?: ClassNames<"header" | "title" | "description">;
  };

export type PropsWithValue<T = {}, TValue = string> = T & {
  defaultValue?: TValue;
  value?: TValue;
  onValueChange?(value: TValue): void;
};

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

export type PropsWithModal<T = {}> = T & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?(open: boolean): void;
};

export type PropsWithTrigger<T = {}> = T & {
  showLabel?: boolean;
  triggerLabel?: string;
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  classNames?: ClassNames<"triggerLabel" | "triggerIcon" | "trigger">;
};

export type ModalPropsWithSide<T = {}> = PropsWithSide<PropsWithModal<T>>;

/**
 * This type defines a standard interface for implemented forms. It provides access to various methods that enable users to have
 * granular external control over the form and its behaviours.
 */
export type ModalFormProps<T = {}, TFormData = any> = PropsWithModal<
  PropsWithForm<
    T,
    TFormData
  >
>;

export type ModalFormPropsWithTrigger<T = {}, TFormData = unknown> =
  PropsWithTrigger<
    PropsWithModal<
      PropsWithForm<
        T,
        TFormData
      >
    >
  >;
