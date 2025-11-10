/**
 * Created At: 2025.07.14:09:24:58
 * @author - @FL03
 * @file - types.tsx
 */
import { ReactNode } from "react";

// The `ComponentPropsWithTrigger` type defines properties for components that include a trigger element.
type ComponentPropsWithTrigger<T = {}> = T & {
  triggerClassName?: string;
  triggerIcon?: ReactNode;
  triggerCloseIcon?: ReactNode;
  showTriggerLabel?: boolean;
};

// The `ModalProps` type defines properties for modal components, including open state management.
type ModalProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type ModalPropsWithTrigger = ComponentPropsWithTrigger<ModalProps>;
