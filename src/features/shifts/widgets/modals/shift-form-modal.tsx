/**
 * Created At: 2025.09.11:18:43:40
 * @author - @FL03
 * @file - shift-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { PlusIcon, XIcon } from "lucide-react";
import type { ClassNames } from "@pzzld/core";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { PropsWithModal } from "@/types";
// local
import { ShiftForm } from "../shift-form";
// components
import { IconButton } from "@/components/common/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const ShiftFormDialog: React.FC<
  & React.ComponentPropsWithoutRef<typeof ShiftForm>
  & PropsWithModal<
    React.PropsWithChildren<{
      description?: React.ReactNode;
      title?: React.ReactNode;
      showDescription?: boolean;
      hideTitle?: boolean;
      classNames?: ClassNames<"description" | "title" | "form">;
    }>
  >
> = (
  {
    children,
    className,
    classNames,
    description,
    title = "Shift",
    showDescription,
    hideTitle,
    defaultOpen,
    open,
    onOpenChange,
    onCancel,
    onSuccess,
    ...props
  },
) => (
  <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && <DialogTrigger asChild>{children}</DialogTrigger>}
    <DialogContent>
      <DialogHeader>
        <DialogTitle
          className={cn(
            hideTitle ? "sr-only" : "not-sr-only",
            classNames?.titleClassName,
          )}
        >
          {title}
        </DialogTitle>
        {description && (
          <DialogDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      <div
        className={cn(
          "overflow-y-auto flex flex-1 flex-col h-full w-full",
          className,
        )}
      >
        <ShiftForm
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
        <DialogFooter>
          <DialogClose>
            <XIcon className="size-4" />
            <span>Close</span>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);

export const ShiftFormSheet: React.FC<
  & React.ComponentPropsWithoutRef<typeof ShiftForm>
  & PropsWithModal<
    React.PropsWithChildren<{
      description?: React.ReactNode;
      title?: React.ReactNode;
      showDescription?: boolean;
      hideTitle?: boolean;
      classNames?: ClassNames<"description" | "title" | "form">;
      side?: React.ComponentProps<typeof SheetContent>["side"];
    }>
  >
> = (
  {
    children,
    className,
    classNames,
    description,
    side = "left",
    title = "Shift",
    showDescription,
    hideTitle,
    defaultOpen,
    open,
    onCancel,
    onSuccess,
    onOpenChange,
    ...props
  },
) => (
  <Sheet defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && <SheetTrigger asChild>{children}</SheetTrigger>}
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle
          className={cn(
            hideTitle ? "sr-only" : "not-sr-only",
            classNames?.titleClassName,
          )}
        >
          {title}
        </SheetTitle>
        {description && (
          <SheetDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </SheetDescription>
        )}
      </SheetHeader>
      <div className="flex flex-1 flex-col h-full w-full overflow-y-auto">
        <ShiftForm
          className={cn(classNames?.formClassName)}
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
        <SheetFooter className="w-full">
          <SheetClose>
            <XIcon className="size-4" />
            <span>Close</span>
          </SheetClose>
        </SheetFooter>
      </div>
    </SheetContent>
  </Sheet>
);

export const ShiftFormDrawer: React.FC<
  & React.ComponentPropsWithoutRef<typeof ShiftForm>
  & PropsWithModal<
    React.PropsWithChildren<{
      classNames?: ClassNames<"form" | "description" | "title">;
      description?: React.ReactNode;
      title?: React.ReactNode;
      showDescription?: boolean;
      hideTitle?: boolean;
    }>
  >
> = (
  {
    children,
    className,
    classNames,
    description,
    title = "Shift",
    showDescription,
    hideTitle,
    defaultOpen,
    open,
    onCancel,
    onSuccess,
    onOpenChange,
    ...props
  },
) => (
  <Drawer defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
    {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
    <DrawerContent>
      <DrawerHeader hidden={hideTitle || (!title && !description)}>
        <DrawerTitle
          className={cn(
            hideTitle ? "sr-only" : "not-sr-only",
            classNames?.titleClassName,
          )}
        >
          {title}
        </DrawerTitle>
        {description && (
          <DrawerDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </DrawerDescription>
        )}
      </DrawerHeader>
      <div className="flex flex-1 flex-col h-full w-full overflow-y-auto">
        <ShiftForm
          className={cn(classNames?.formClassName)}
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
          <DrawerClose>
            <XIcon className="size-4" />
            <span>Close</span>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);

export const ShiftFormModal: React.FC<
  & React.ComponentPropsWithoutRef<typeof ShiftForm>
  & PropsWithModal<
    {
      description?: React.ReactNode;
      title?: React.ReactNode;
      triggerIcon?: React.ReactNode;
      triggerLabel?: React.ReactNode;
      triggerSize?: React.ComponentProps<typeof IconButton>["size"];
      triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
      drawer?: boolean;
      isEditing?: boolean;
      showDescription?: boolean;
      hideTitle?: boolean;
      classNames?: ClassNames<
        "description" | "title" | "form" | "icon" | "label" | "trigger"
      >;
    }
  >
> = ({
  description,
  drawer,
  defaultOpen,
  open,
  onOpenChange,
  triggerLabel = "New Shift",
  triggerSize = "icon",
  triggerVariant = "outline",
  title = "New Shift",
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
      <PlusIcon className={cn("size-4", iconClassName)} />
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
      side="left"
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
