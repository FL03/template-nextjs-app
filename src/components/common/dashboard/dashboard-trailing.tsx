/**
 * Created At: 2025.11.19:20:05:22
 * @author - @FL03
 * @directory - src/components/common/dashboard
 * @file - dashboard-trailing.tsx
 */
"use client";
// import
import * as React from "react";
import { PanelBottomCloseIcon, PanelBottomOpenIcon, XIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
import { Slot } from "@radix-ui/react-slot";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
// local
import { WithPanelProps } from "./types";
// components
import { IconButton } from "@/components/common/button";
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

export const DashboardDrawer: React.FC<
  & React.ComponentPropsWithoutRef<typeof Drawer>
  & React.PropsWithChildren<{
    classNames?: ClassNames<
      | "content"
      | "footer"
      | "header"
      | "trigger"
      | "description"
      | "label"
      | "title"
    >;
    description?: React.ReactNode;
    title?: React.ReactNode;
    triggerIcon?: React.ReactNode;
    triggerCloseIcon?: React.ReactNode;
    triggerSize?: React.ComponentProps<typeof IconButton>["size"];
    triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
    showTriggerLabel?: boolean;
    showDescription?: boolean;
    hideTitle?: boolean;
  }>
> = ({
  children,
  classNames,
  description,
  title,
  showDescription,
  hideTitle,
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  triggerSize = "icon",
  triggerVariant = "ghost",
  triggerIcon = <PanelBottomOpenIcon className="size-8" />,
  triggerCloseIcon = <PanelBottomCloseIcon className="size-8" />,
  showTriggerLabel,
  ...props
}) => {
  const { isOpen, setIsOpen } = useModal({
    defaultOpen,
    open: openProp,
    onOpenChange,
  });
  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      {...props}
    >
      <DrawerTrigger asChild>
        <IconButton
          label={isOpen ? "Close" : "Open"}
          className={cn(
            classNames?.triggerClassName,
          )}
        >
          {isOpen ? triggerCloseIcon : triggerIcon}
        </IconButton>
      </DrawerTrigger>
      <DrawerContent className="flex-1 h-full w-full">
        <DrawerHeader
          className={cn("w-full", classNames?.headerClassName)}
          hidden={!title && !description}
        >
          <DrawerTitle
            className={cn(
              classNames?.titleClassName,
              hideTitle ? "sr-only" : "not-sr-only",
            )}
            hidden={!title}
          >
            {title}
          </DrawerTitle>
          <DrawerDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
            hidden={!description}
          >
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div
          className={cn(
            "relative z-auto flex flex-1 flex-col h-full w-full gap-2 overflow-y-auto",
            classNames?.contentClassName,
          )}
        >
          {children}
          <DrawerFooter
            className={cn(
              "flex items-center gap-2 w-full",
              classNames?.footerClassName,
            )}
          >
            <DrawerClose asChild>
              <IconButton label="Close" variant="outline">
                <XIcon className="size-4" />
              </IconButton>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
DashboardDrawer.displayName = "DashboardDrawer";

export const DashboardTrailingPanel: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & {
    asChild?: boolean;
    fullWidth?: boolean;
    scrollable?: boolean;
  }
> = (
  {
    ref,
    className,
    asChild,
    fullWidth,
    scrollable,
    ...props
  },
) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-trailing"
      className={cn(
        "flex flex-col order-last right-0 relative z-auto h-full",
        fullWidth ? "w-full" : "w-fit",
        "w-fit [&_:is([data-slot=sheet-content],[data-slot=drawer-content])_&]:w-full",
        scrollable && "overflow-y-auto",
        className,
      )}
    />
  );
};
DashboardTrailingPanel.displayName = "DashboardTrailingPanel";

// DashboardTrailing
export const DashboardTrailing: React.FC<
  WithPanelProps<
    React.ComponentPropsWithoutRef<typeof DashboardTrailingPanel>
  >
> = ({
  className,
  pinned,
  description,
  title,
  showDescription,
  hideTitle,
  defaultOpen,
  open,
  onOpenChange,
  ...props
}) => {
  const isMobile = useIsMobile();
  if (isMobile && !pinned) {
    return (
      <DashboardDrawer
        description={description}
        title={title}
        showDescription={showDescription}
        hideTitle={hideTitle}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        triggerSize="icon-lg"
        classNames={{
          triggerClassName: cn("fixed bottom-6 right-2 z-[99]"),
        }}
      >
        <DashboardTrailingPanel {...props} />
      </DashboardDrawer>
    );
  }
  return <DashboardTrailingPanel {...props} />;
};
DashboardTrailing.displayName = "DashboardTrailing";
