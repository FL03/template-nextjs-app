/**
 * Created At: 2025-04-13:13:36:56
 * @author - @FL03
 * @file - props.ts
 */
import type { Button } from "@/components/ui/button";
// local
import type { PropsWithClassNames } from "./classnames";
import type { PropsWithForm } from "./form";
import type { PropsWithNamedChildren, PropsWithSide } from "./props";

export type PropsWithModal<T = {}> = T & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?(open: boolean): void;
};

export type PropsWithTrigger<T = {}> = PropsWithClassNames<
  PropsWithNamedChildren<
    T & {
      showLabel?: boolean;
      triggerLabel?: string;
      triggerSize?: React.ComponentProps<typeof Button>["size"];
      triggerVariant?: React.ComponentProps<typeof Button>["variant"];
    },
    "triggerIcon"
  >,
  "trigger" | "icon" | "label"
>;

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
