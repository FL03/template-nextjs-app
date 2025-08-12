export type ModalClassNames = {
  descriptionClassName?: string;
  titleClassName?: string;
  triggerClassName?: boolean;
};

export type ModalProps = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: React.Dispatch<boolean>;
  onCancel?: () => void;
};

type ErrorT = Error | string;

/**
 * This type defines a standard interface for implemented forms. It provides access to various methods that enable users to have
 * granular external control over the form and its behaviours.
 */

export type ModalFormProps<TForm = unknown> = {
  className?: string;
  classNames?: {
    descriptionClassName?: string;
    titleClassName?: string;
  };
  description?: React.ReactNode;
  title?: React.ReactNode;
  defaultValues?: Partial<TForm>;
  values?: TForm;
  onCancel?: () => void;
  onError?: React.Dispatch<ErrorT>;
  onSubmit?: React.Dispatch<TForm>;
  onSubmitSuccess?: React.Dispatch<TForm>;
} & ModalProps;

export type ModalPropsWithSide<TForm = unknown> =
  & { side?: "left" | "right" | "top" | "bottom" }
  & ModalFormProps<TForm>;

export type ModalWithTriggerProps<TForm = unknown> = {
  showLabel?: boolean;
  ClassNames?: ModalClassNames;
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
} & Omit<ModalFormProps<TForm>, "classNames">;
