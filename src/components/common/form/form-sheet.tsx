// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

import { ModalPropsWithSide } from './types';

export const FormSheet: React.FC<React.PropsWithChildren<ModalPropsWithSide>> = ({
  children,
  className,
  description,
  side = 'right',
  title,
  defaultOpen = false,
  open: openProp,
  onCancel,
  onOpenChange,
  ...props
}) => {
  // use the useIsMobile hook to determine if the device is mobile
  const isMobile = useIsMobile();
  // memoize the external open state
  const isOpen = React.useMemo<boolean | undefined>(() => openProp, [openProp]);
  // initialize the internal open state
  const [_open, _setOpen] = React.useState(isOpen || defaultOpen);
  // a function to handle the open state changes
  const handleOpenChange = (open: boolean) => {
    // use the callback to handle any changes to the open state
    if (onOpenChange) onOpenChange(open);
    // store the changes internally
    _setOpen(open);
  };
  // reflect any external changes to the open state
  React.useEffect(() => {
    if (isOpen !== undefined && isOpen !== _open) {
      handleOpenChange(isOpen);
    }
  }, [isOpen]);
  // render the component
  return (
    <Sheet
      {...props}
      defaultOpen={defaultOpen}
      open={_open}
      onOpenChange={handleOpenChange}
    >
      <SheetContent
        className={cn('sm:max-w-[425px]', className)}
        side={isMobile ? 'bottom' : side}
      >
        <SheetHeader className="flex flex-col w-full">
          {title && <SheetTitle className="text-xl tracking-tight">{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
FormSheet.displayName = 'FormSheet';

export default FormSheet;
