/**
 * Created At: 2025.09.11:18:43:40
 * @author - @FL03
 * @file - shift-form.tsx
 */
'use client';
// imports
import * as React from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import type { ClassNames } from '@pzzld/core';
// project
import { useIsMobile } from '@/hooks/use-mobile';
import { useModal } from '@/hooks/use-modal';
import { cn } from '@/lib/utils';
import { PropsWithModal } from '@/types';
// local
import { ShiftForm } from '../shift-form';
// components
import { IconButton } from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const ShiftFormDialog: React.FC<
  React.ComponentPropsWithoutRef<typeof ShiftForm> &
    React.PropsWithChildren<
      PropsWithModal<{
        description?: React.ReactNode;
        title?: React.ReactNode;
        showDescription?: boolean;
        hideTitle?: boolean;
        side?: React.ComponentProps<typeof SheetContent>['side'];
        classNames?: ClassNames<
          | 'content'
          | 'footer'
          | 'header'
          | 'description'
          | 'title'
          | 'form'
          | 'trigger'
        >;
      }>
    >
> = ({
  children,
  classNames,
  description,
  title,
  showDescription,
  hideTitle,
  defaultOpen,
  open,
  onOpenChange,
  onCancel,
  onSuccess,
  ...props
}) => (
  <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && (
      <DialogTrigger asChild className={classNames?.triggerClassName}>
        {children}
      </DialogTrigger>
    )}
    <DialogContent
      hidden={hideTitle}
      className={cn('', classNames?.contentClassName)}
    >
      <DialogHeader className={cn('w-full', classNames?.headerClassName)}>
        {title && (
          <DialogTitle
            className={cn(
              hideTitle ? 'sr-only' : 'not-sr-only',
              classNames?.titleClassName,
            )}
          >
            {title}
          </DialogTitle>
        )}
        {description && (
          <DialogDescription
            className={cn(
              showDescription ? 'not-sr-only' : 'sr-only',
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      <ShiftForm
        className={cn('flex-1 overflow-y-auto', classNames?.formClassName)}
        onCancel={() => {
          onOpenChange?.(false);
          onCancel?.();
        }}
        onSuccess={() => {
          onOpenChange?.(false);
          onSuccess?.();
        }}
        {...props}
      />
    </DialogContent>
  </Dialog>
);

export const ShiftFormSheet: React.FC<
  React.ComponentPropsWithoutRef<typeof ShiftForm> &
    React.PropsWithChildren<
      PropsWithModal<{
        description?: React.ReactNode;
        title?: React.ReactNode;
        showDescription?: boolean;
        hideTitle?: boolean;
        side?: React.ComponentProps<typeof SheetContent>['side'];
        classNames?: ClassNames<
          | 'content'
          | 'footer'
          | 'header'
          | 'description'
          | 'title'
          | 'form'
          | 'trigger'
        >;
      }>
    >
> = ({
  children,
  classNames,
  description,
  title,
  showDescription,
  hideTitle,
  defaultOpen,
  open,
  onCancel,
  onSuccess,
  onOpenChange,
  side = 'left',
  ...props
}) => (
  <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && (
      <SheetTrigger asChild className={classNames?.triggerClassName}>
        {children}
      </SheetTrigger>
    )}
    <SheetContent
      side={side}
      className={cn(
        'not-[has-data[-slot=sheet-header]]]:pt-8',
        classNames?.contentClassName,
      )}
    >
      {Boolean(description || title) && (
        <SheetHeader hidden={hideTitle}>
          {title && (
            <SheetTitle
              className={cn(
                hideTitle ? 'sr-only' : 'not-sr-only',
                classNames?.titleClassName,
              )}
            >
              {title}
            </SheetTitle>
          )}
          {description && (
            <SheetDescription
              className={cn(
                showDescription ? 'not-sr-only' : 'sr-only',
                classNames?.descriptionClassName,
              )}
            >
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
      )}
      <ShiftForm
        className={cn('px-4 flex-1 overflow-y-auto', classNames?.formClassName)}
        onCancel={() => {
          onOpenChange?.(false);
          onCancel?.();
        }}
        onSuccess={() => {
          onOpenChange?.(false);
          onSuccess?.();
        }}
        {...props}
      />
      <SheetFooter className={cn('w-full', classNames?.footerClassName)}>
        <SheetClose asChild>
          <IconButton label='Close'>
            <XIcon className='size-4' />
          </IconButton>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const ShiftFormDrawer: React.FC<
  React.ComponentPropsWithoutRef<typeof ShiftForm> &
    PropsWithModal<
      React.PropsWithChildren<{
        classNames?: ClassNames<
          | 'content'
          | 'footer'
          | 'header'
          | 'form'
          | 'description'
          | 'title'
          | 'trigger'
        >;
        description?: React.ReactNode;
        title?: React.ReactNode;
        showDescription?: boolean;
        hideTitle?: boolean;
      }>
    >
> = ({
  children,
  className,
  classNames,
  description,
  title,
  showDescription,
  hideTitle,
  defaultOpen,
  open,
  onCancel,
  onSuccess,
  onOpenChange,
  ...props
}) => (
  <Drawer defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && (
      <DrawerTrigger asChild className={classNames?.triggerClassName}>
        {children}
      </DrawerTrigger>
    )}
    <DrawerContent
      className={cn('not-[has-data[-slot=drawer-header]]]:pt-8', className)}
    >
      {Boolean(description || title) && (
        <DrawerHeader
          className={cn('w-full', classNames?.headerClassName)}
          hidden={hideTitle}
        >
          {title && (
            <DrawerTitle
              className={cn(
                hideTitle ? 'sr-only' : 'not-sr-only',
                classNames?.titleClassName,
              )}
            >
              {title}
            </DrawerTitle>
          )}
          {description && (
            <DrawerDescription
              className={cn(
                showDescription ? 'not-sr-only' : 'sr-only',
                classNames?.descriptionClassName,
              )}
            >
              {description}
            </DrawerDescription>
          )}
        </DrawerHeader>
      )}
      <div
        className={cn(
          'flex flex-1 flex-col h-full w-full overflow-y-auto',
          classNames?.contentClassName,
        )}
      >
        <ShiftForm
          className={cn('px-4', classNames?.formClassName)}
          onCancel={() => {
            onOpenChange?.(false);
            onCancel?.();
          }}
          onSuccess={() => {
            onOpenChange?.(false);
            onSuccess?.();
          }}
          {...props}
        />
        <DrawerFooter className='w-full'>
          <DrawerClose asChild>
            <IconButton label='Close'>
              <XIcon className='size-4' />
            </IconButton>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);

export const ShiftFormModal: React.FC<
  React.ComponentPropsWithoutRef<typeof ShiftForm> &
    PropsWithModal<{
      description?: React.ReactNode;
      title?: React.ReactNode;
      triggerIcon?: React.ReactNode;
      triggerLabel?: React.ReactNode;
      triggerSize?: React.ComponentProps<typeof IconButton>['size'];
      triggerVariant?: React.ComponentProps<typeof IconButton>['variant'];
      drawer?: boolean;
      isEditing?: boolean;
      showDescription?: boolean;
      hideTitle?: boolean;
      classNames?: ClassNames<
        'description' | 'title' | 'form' | 'icon' | 'label' | 'trigger'
      >;
    }>
> = ({
  description,
  drawer,
  defaultOpen,
  open,
  onOpenChange,
  triggerLabel = 'New Shift',
  triggerSize = 'icon',
  triggerVariant = 'outline',
  title = 'New Shift',
  classNames: {
    iconClassName,
    labelClassName,
    triggerClassName,
    ...classNames
  } = {},
  ...props
}) => {
  const isMobile = useIsMobile();
  const modal = useModal({ defaultOpen, open, onOpenChange });

  const Trigger = () => (
    <IconButton
      className={triggerClassName}
      classNames={{ labelClassName }}
      size={triggerSize}
      variant={triggerVariant}
      onClick={modal.toggle}
    >
      <PlusIcon className={cn('size-4', iconClassName)} />
    </IconButton>
  );

  if (isMobile || drawer) {
    return (
      <ShiftFormDrawer
        classNames={classNames}
        description={description}
        title={title}
        open={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        {...props}
      >
        <Trigger />
      </ShiftFormDrawer>
    );
  }
  return (
    <ShiftFormSheet
      side='left'
      classNames={classNames}
      description={description}
      title={title}
      open={modal.isOpen}
      onOpenChange={modal.setIsOpen}
      {...props}
    >
      <Trigger />
    </ShiftFormSheet>
  );
};
