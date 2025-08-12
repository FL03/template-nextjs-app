/**
 * Created At: 2025.07.14:09:24:58
 * @author - @FL03
 * @file - types.tsx
 */
import { ReactNode } from 'react';

/**
 * This type defines the properties for components that have a pre-designed trigger mechanism.
 */
export type TriggeredProps = {
  triggerClassName?: string;
  triggerIcon?: ReactNode;
  triggerCloseIcon?: ReactNode;
  showTriggerLabel?: boolean;
};

/**
 * The `ModalProps` type defines the base properties common to all _modal_ like components.
 */
export type ModalProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export type TriggeredModalProps = ModalProps & TriggeredProps;
