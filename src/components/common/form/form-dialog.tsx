// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// local
import { ModalFormProps, ModalWithTriggerProps } from './types';


export const FormDialog: React.FC<React.PropsWithChildren<ModalFormProps> > = ({
  children,
  className,
  description,
  title,
  defaultOpen = false,
  open: openProp,
  onCancel,
  onOpenChange,
  ...props
}) => {
  const isOpen = React.useMemo<boolean | undefined>(() => openProp, [openProp]);
  const [_open, _setOpen] = React.useState(isOpen || defaultOpen);

  const handleOpenChange = (open: boolean) => {
    // use the callback to handle any changes to the open state
    if (onOpenChange) onOpenChange(open);
    // reflect the changes internally
    _setOpen(open);
  };

  const _handleCancel = () => {
    onCancel?.();
    _setOpen(false);
  };

  React.useEffect(() => {
    if (isOpen !== undefined && isOpen !== _open) {
      handleOpenChange(isOpen);
    }
  }, [isOpen]);

  // render the component
  return (
    <Dialog
      {...props}
      defaultOpen={defaultOpen}
      open={_open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className={cn('sm:max-w-[425px]', className)}>
        <DialogHeader className="flex flex-col w-full gap-2">
          {title && (
            <DialogTitle className="text-xl tracking-tight">
              {title}
            </DialogTitle>
          )}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
FormDialog.displayName = 'FormDialog';

export const FormDialogWithTrigger: React.FC<
  React.PropsWithChildren<ModalWithTriggerProps>
> = ({
  children,
  className,
  description,
  title,
  triggerIcon,
  triggerLabel,
  triggerVariant = 'outline',
  triggerSize = 'default',
  defaultOpen = false,
  open: openProp,
  onCancel,
  onOpenChange,
  ...props
}) => {
  const isOpen = React.useMemo<boolean | undefined>(() => openProp, [openProp]);
  const [_open, _setOpen] = React.useState(isOpen || defaultOpen);

  const handleOpenChange = (open: boolean) => {
    // use the callback to handle any changes to the open state
    onOpenChange?.(open);
    // reflect the changes internally
    _setOpen(open);
  };

  const _handleCancel = () => {
    onCancel?.();
    _setOpen(false);
  };

  React.useEffect(() => {
    if (isOpen !== undefined && isOpen !== _open) {
      handleOpenChange(isOpen);
    }
  }, [isOpen]);
  // render the component
  return (
    <Dialog
      {...props}
      defaultOpen={defaultOpen}
      open={_open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          onClick={() => handleOpenChange(!_open)}
        >
          {triggerIcon}
          {triggerLabel && <span>{triggerLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn('sm:max-w-[425px]', className)}>
        <DialogHeader className="flex flex-col w-full gap-2">
          {title && (
            <DialogTitle className="text-xl tracking-tight">
              {title}
            </DialogTitle>
          )}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
FormDialogWithTrigger.displayName = 'FormDialogWithTrigger';

export default FormDialog;
