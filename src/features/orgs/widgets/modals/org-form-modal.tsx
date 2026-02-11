/**
 * Created At: 2025.11.08:10:31:51
 * @author - @FL03
 * @directory - src/features/orgs/widgets/modals
 * @file - org-form-modal.tsx
 */
'use client';
// imports
import * as React from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import { ClassNames } from '@pzzld/core';
// project
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useModal } from '@/hooks/use-modal';
import type { PropsWithModal } from '@/types';
// local
import { OrganizationForm } from '../org-form';
// components
import { IconButton } from '@/components/common/button';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/sheet';

export const OrganizationFormDialog: React.FC<
  React.ComponentProps<typeof OrganizationForm> &
    React.PropsWithChildren<
      PropsWithModal<{
        className?: string;
        description?: React.ReactNode;
        title?: React.ReactNode;
        showDescription?: boolean;
        showLegend?: boolean;
        classNames?: ClassNames<'description' | 'title' | 'form'>;
      }>
    >
> = ({
  children,
  className,
  classNames,
  defaultOpen,
  open,
  description,
  title,
  showDescription,
  onCancel,
  onSuccess,
  onOpenChange,
  ...props
}) => (
  <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && <DialogTrigger asChild>{children}</DialogTrigger>}
    <DialogContent className={cn('max-h-[75%]', className)}>
      <div
        className={cn(
          'relative z-auto overflow-y-auto flex flex-1 flex-col h-full w-full',
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle className={classNames?.titleClassName}>
            {title}
          </DialogTitle>
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
        <OrganizationForm
          compact
          className={classNames?.formClassName}
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
      </div>
    </DialogContent>
  </Dialog>
);

export const OrganizationFormDrawer: React.FC<
  React.ComponentProps<typeof OrganizationForm> &
    React.PropsWithChildren<
      PropsWithModal<{
        className?: string;
        description?: React.ReactNode;
        title?: React.ReactNode;
        showDescription?: boolean;
        showLegend?: boolean;
        classNames?: ClassNames<'description' | 'title' | 'form'>;
      }>
    >
> = ({
  children,
  className,
  classNames,
  description,
  title,
  showDescription,
  defaultOpen,
  open,
  onCancel,
  onSuccess,
  onOpenChange,
  ...props
}) => (
  <Drawer defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
    <DrawerContent>
      <div
        className={cn(
          'relative z-auto overflow-y-auto flex flex-1 flex-col h-full w-full',
          className,
        )}
      >
        <DrawerHeader>
          <DrawerTitle className={cn('sr-only', classNames?.titleClassName)}>
            {title}
          </DrawerTitle>
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
        <OrganizationForm
          compact
          className={classNames?.formClassName}
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
        <DrawerFooter>
          <DrawerClose asChild>
            <IconButton label='Close' variant='outline'>
              <XIcon className='size-4' />
            </IconButton>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);

export const OrganizationFormSheet: React.FC<
  React.ComponentProps<typeof OrganizationForm> &
    React.PropsWithChildren<
      PropsWithModal<{
        className?: string;
        description?: React.ReactNode;
        title?: React.ReactNode;
        showDescription?: boolean;
        showLegend?: boolean;
        classNames?: ClassNames<'description' | 'title' | 'form'>;
      }>
    >
> = ({
  children,
  className,
  classNames,
  description,
  title,
  showDescription,
  defaultOpen,
  open,
  onOpenChange,
  onCancel,
  onSuccess,
  ...props
}) => (
  <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && <DialogTrigger asChild>{children}</DialogTrigger>}
    <SheetContent>
      <SheetHeader>
        <SheetTitle className={classNames?.titleClassName}>{title}</SheetTitle>
        <SheetDescription
          className={cn(
            showDescription ? 'not-sr-only' : 'sr-only',
            classNames?.descriptionClassName,
          )}
          hidden={!description}
        >
          {description}
        </SheetDescription>
      </SheetHeader>
      <div
        className={cn(
          'overflow-y-auto flex flex-1 flex-col h-full w-full',
          className,
        )}
      >
        <OrganizationForm
          compact
          className={classNames?.formClassName}
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
        <SheetFooter>
          <SheetClose asChild>
            <IconButton label='Close' variant='outline'>
              <XIcon className='size-4' />
            </IconButton>
          </SheetClose>
        </SheetFooter>
      </div>
    </SheetContent>
  </Sheet>
);

export const OrganizationFormModal: React.FC<
  React.ComponentPropsWithoutRef<typeof OrganizationForm> &
    React.PropsWithChildren<
      PropsWithModal<{
        className?: string;
        triggerIcon?: React.ReactNode;
        triggerLabel?: React.ReactNode;
        triggerSize?: React.ComponentProps<typeof Button>['size'];
        triggerVariant?: React.ComponentProps<typeof Button>['variant'];
        title?: React.ReactNode;
        description?: React.ReactNode;
        isEditing?: boolean;
        showDescription?: boolean;
        classNames?: ClassNames<
          'icon' | 'label' | 'trigger' | 'title' | 'description' | 'form'
        >;
      }>
    >
> = ({
  classNames = {},
  triggerLabel = 'New Organization',
  triggerSize = 'icon',
  triggerVariant = 'outline',
  defaultOpen,
  open,
  description = 'Create a new organization or edit an existing one.',
  title = 'Organization Form',
  onOpenChange,
  ...props
}) => {
  const modal = useModal({
    defaultOpen,
    open,
    onOpenChange,
  });
  const isMobile = useIsMobile();

  const { iconClassName, labelClassName, triggerClassName, ...classes } =
    classNames;

  const Trigger = () => (
    <IconButton
      className={triggerClassName}
      size={triggerSize}
      variant={triggerVariant}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        // toggle the modal
        modal.toggle();
      }}
    >
      <PlusIcon className={cn('size-4', iconClassName)} />
    </IconButton>
  );

  if (isMobile) {
    return (
      <OrganizationFormDrawer
        classNames={classes}
        open={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        description={description}
        title={title}
        {...props}
      >
        <Trigger />
      </OrganizationFormDrawer>
    );
  }
  return (
    <OrganizationFormDialog
      classNames={classes}
      open={modal.isOpen}
      onOpenChange={modal.setIsOpen}
      description={description}
      title={title}
      {...props}
    >
      <Trigger />
    </OrganizationFormDialog>
  );
};
