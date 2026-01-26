/**
 * Created At: 2025.11.23:13:30:48
 * @author - @FL03
 * @directory - src/components/common/dashboard
 * @file - dashboard-panels.tsx
 */
"use client";
// import
import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import {
  MenuIcon,
  PanelBottomCloseIcon,
  PanelBottomOpenIcon,
  XIcon,
} from "lucide-react";
import { type ClassNames } from "@pzzld/core";
import { Slot } from "@radix-ui/react-slot";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
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

type WithPanelProps<T = {}> = T & {
  action?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
  pinned?: boolean;
  hideTitle?: boolean;
  showDescription?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
  triggerSize?: React.ComponentProps<typeof IconButton>["size"];
  triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
  classNames?: ClassNames<
    | "action"
    | "content"
    | "footer"
    | "header"
    | "description"
    | "title"
    | "trigger"
    | "triggerLabel"
  >;
};

export const dashboardPanelVariants = cva(
  "group relative z-auto flex flex-col h-full gap-4 lg:gap-6",
  {
    defaultVariants: {
      position: "default",
      variant: "default",
    },
    variants: {
      position: {
        default: "",
        leading: "order-first left-0",
        trailing: "order-last right-0",
      },
      variant: {
        default: "w-auto",
        modal: "flex-1 w-full",
        panel: "min-w-xs w-fit",
      },
    },
  },
);

const DashboardPanel: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "title">
  & VariantProps<typeof dashboardPanelVariants>
  & {
    asChild?: boolean;
    scrollable?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  scrollable,
  position = "default",
  variant = "default",
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-panel"
      className={cn(
        dashboardPanelVariants({ position, variant }),
        scrollable && "overflow-y-auto",
        className,
      )}
    />
  );
};
DashboardPanel.displayName = "DashboardPanel";

const DashboardDrawer: React.FC<
  & React.ComponentPropsWithoutRef<typeof Drawer>
  & React.PropsWithChildren<{
    classNames?: ClassNames<
      | "content"
      | "footer"
      | "header"
      | "description"
      | "title"
      | "trigger"
      | "triggerLabel"
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
          classNames={{ labelClassName: classNames?.triggerLabelClassName }}
        >
          {isOpen ? triggerCloseIcon : triggerIcon}
        </IconButton>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          "not-[has-data-[slot=drawer-header]]:pt-8",
          classNames?.contentClassName,
        )}
      >
        {Boolean(title || description) && (
          <DrawerHeader
            className={cn("w-full", classNames?.headerClassName)}
            hidden={hideTitle}
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
        )}
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
      </DrawerContent>
    </Drawer>
  );
};
DashboardDrawer.displayName = "DashboardDrawer";

/** The `DashboardSheet` component is designed to wrap the leading dashboard panel so that it may be dynamically _hidden_ using this widget. */
const DashboardSheet: React.FC<
  & React.ComponentPropsWithoutRef<typeof Sheet>
  & React.PropsWithChildren<{
    classNames?: ClassNames<
      | "content"
      | "footer"
      | "header"
      | "description"
      | "title"
      | "trigger"
      | "triggerLabel"
    >;
    description?: React.ReactNode;
    title?: React.ReactNode;
    side?: React.ComponentProps<typeof SheetContent>["side"];
    triggerSize?: React.ComponentProps<typeof IconButton>["size"];
    triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
    triggerIcon?: React.ReactNode;
    triggerCloseIcon?: React.ReactNode;
    hideFooter?: boolean;
    hideTitle?: boolean;
    showDescription?: boolean;
  }>
> = ({
  children,
  classNames,
  description,
  title,
  hideFooter,
  hideTitle,
  showDescription,
  defaultOpen,
  open,
  onOpenChange,
  side = "left",
  triggerSize = "icon-lg",
  triggerVariant = "ghost",
  triggerIcon = <MenuIcon className="size-8" />,
  triggerCloseIcon = <XIcon className="size-8" />,
}) => {
  const { isOpen, setIsOpen } = useModal({
    defaultOpen,
    open,
    onOpenChange,
  });
  return (
    <Sheet
      data-slot="dashboard-sheet"
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={setIsOpen}
    >
      <SheetTrigger asChild>
        <IconButton
          className={classNames?.triggerClassName}
          size={triggerSize}
          variant={triggerVariant}
          label={isOpen ? "Close" : "Open"}
          classNames={{ labelClassName: classNames?.triggerLabelClassName }}
        >
          {isOpen ? triggerCloseIcon : triggerIcon}
        </IconButton>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={cn(
          "not-[has-data-[slot=sheet-header]]:pt-8",
          classNames?.contentClassName,
        )}
      >
        {Boolean(title || description) && (
          <SheetHeader
            className={cn("w-full", classNames?.headerClassName)}
            hidden={hideTitle}
          >
            {title && (
              <SheetTitle
                className={cn(
                  classNames?.titleClassName,
                  hideTitle ? "sr-only" : "not-sr-only",
                )}
              >
                {title}
              </SheetTitle>
            )}
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
        )}
        {children}
        <SheetFooter
          className={cn("w-full", classNames?.footerClassName)}
          hidden={hideFooter}
        >
          <SheetClose asChild>
            <IconButton label="Close" variant="outline">
              <XIcon className="size-4" />
            </IconButton>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
DashboardSheet.displayName = "DashboardSheet";

// DashboardDrawerPanel
const DashboardDrawerPanel: React.FC<
  & Omit<React.ComponentPropsWithoutRef<typeof DashboardPanel>, "variant">
  & WithPanelProps<{}>
> = ({
  className,
  classNames,
  pinned,
  description,
  title,
  showDescription,
  hideTitle,
  defaultOpen,
  open,
  onOpenChange,
  position = "trailing",
  triggerSize = "icon-lg",
  triggerVariant = "ghost",
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
        triggerSize={triggerSize}
        triggerVariant={triggerVariant}
        classNames={{
          ...classNames,
          triggerClassName: cn(
            "fixed z-30 bottom-6 right-2",
            classNames?.triggerClassName,
          ),
        }}
      >
        <DashboardPanel scrollable variant="modal" {...props} />
      </DashboardDrawer>
    );
  }
  return <DashboardPanel variant="panel" position={position} {...props} />;
};
DashboardDrawerPanel.displayName = "DashboardDrawerPanel";

// DashboardSheetPanel
const DashboardSheetPanel: React.FC<
  & Omit<React.ComponentPropsWithoutRef<typeof DashboardPanel>, "variant">
  & WithPanelProps<{
    side?: React.ComponentProps<typeof SheetContent>["side"];
  }>
> = (
  {
    classNames,
    description,
    title,
    pinned,
    hideTitle,
    showDescription,
    defaultOpen,
    open,
    onOpenChange,
    position = "leading",
    side = "left",
    triggerSize = "icon-lg",
    triggerVariant = "default",
    ...props
  },
) => {
  const isMobile = useIsMobile();
  if (isMobile && !pinned) {
    return (
      <DashboardSheet
        side={side}
        description={description}
        title={title}
        showDescription={showDescription}
        hideTitle={hideTitle}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        triggerSize={triggerSize}
        triggerVariant={triggerVariant}
        classNames={{
          ...classNames,
          triggerClassName: cn(
            "fixed z-30 bottom-6 left-2",
            classNames?.triggerClassName,
          ),
        }}
      >
        <DashboardPanel scrollable variant="modal" {...props} />
      </DashboardSheet>
    );
  }
  return <DashboardPanel variant="panel" position={position} {...props} />;
};
DashboardSheetPanel.displayName = "DashboardSheetPanel";

export {
  DashboardDrawer,
  DashboardDrawerPanel,
  DashboardPanel,
  DashboardSheet,
  DashboardSheetPanel,
};
