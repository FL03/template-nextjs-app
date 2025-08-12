/**
 * Created At: 2025-04-13:13:36:56
 * @author - @FL03
 * @file - props.ts
 */

import { ReactNode } from "react";

export type AsChild = { asChild?: boolean };

/** A type alias for defining all possible _text sizes_ provided by tailwindcss. */
export type TextSize =
  | "base"
  | "xs"
  | "sm"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

/** A type defining binary string variants of `left` or `right`. */
export type SideX = "left" | "right";
/** A type defining binary string variants of `top` or `bottom`. */
export type SideY = "top" | "bottom";
/** A simple type literal for the four sides of a 2-dimensional surface; i.e. left, right, top, bottom. */
export type LRTB = SideX | SideY;

export type PropsWithDescription = {
  description?: ReactNode;
};

export type PropsWithTitle = {
  title?: ReactNode;
};

export type PropsWithSides = {
  side?: LRTB;
};

export type ModalProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCancel?: () => void;
};

export type ModalPropsWithSides = ModalProps & { side?: LRTB };

export type ModalWithTriggerProps = {
  showLabel?: boolean;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  triggerSize?: "default" | "sm" | "lg" | "icon";
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
} & ModalProps;
