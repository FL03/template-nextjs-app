/**
 * Created At: 2025.09.30:14:17:33
 * @author - @FL03
 * @directory - src/types/props
 * @file - header.tsx
 */
// imports
import { ReactNode } from "react";
// local
import { PropsWithClassNames } from "./classnames";
import type { LRTB } from "./variants";

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
  & PropsWithClassNames<
    {
      description?: ReactNode;
      title?: ReactNode;
    },
    "descriptionClassName" | "titleClassName"
  >;

export type PropsWithValue<T = {}, TValue = string> = T & {
  defaultValue?: TValue;
  value?: TValue;
  onValueChange?(value: TValue): void;
};


