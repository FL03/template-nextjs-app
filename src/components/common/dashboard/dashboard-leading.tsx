/**
 * Created At: 2025.07.13:10:07:27
 * @author - @FL03
 * @file - dashboard-panel.tsx
 */
"use client";
// import
import * as React from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
import { Slot } from "@radix-ui/react-slot";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
// local
import { DashboardPanel } from "./dashboard-panel";
import { WithPanelProps } from "./types";
// components
import { IconButton } from "@/components/common/button";
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

const DashboardLeadingPanel: React.FC<
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
      data-slot="dashboard-leading"
      className={cn(
        "flex flex-col order-first left-0 relative z-auto h-full",
        fullWidth ? "w-full" : "w-fit",
        scrollable && "overflow-y-auto",
        className,
      )}
    />
  );
};
DashboardLeadingPanel.displayName = "DashboardLeadingPanel";

/** The `DashboardSheet` component is designed to wrap the leading dashboard panel so that it may be dynamically _hidden_ using this widget. */
export const DashboardSheet: React.FC<
  & React.ComponentPropsWithoutRef<typeof Sheet>
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
    side?: React.ComponentProps<typeof SheetContent>["side"];
    triggerSize?: React.ComponentProps<typeof IconButton>["size"];
    triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
    triggerIcon?: React.ReactNode;
    triggerCloseIcon?: React.ReactNode;
    scrollable?: boolean;
    hideTitle?: boolean;
    showDescription?: boolean;
  }>
> = ({
  children,
  classNames,
  defaultOpen,
  description,
  title,
  hideTitle,
  scrollable,
  showDescription,
  open: openProp,
  onOpenChange,
  side = "left",
  triggerSize = "icon",
  triggerVariant = "ghost",
  triggerIcon = <MenuIcon className="size-8" />,
  triggerCloseIcon = <XIcon className="size-8" />,
}) => {
  const { isOpen, setIsOpen } = useModal({
    defaultOpen,
    open: openProp,
    onOpenChange,
  });
  const hasHeader = React.useMemo(() => (
    Boolean(title) || Boolean(description)
  ), [description, title]);
  // render the Sidebar component
  return (
    <Sheet
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={setIsOpen}
    >
      <SheetTrigger asChild>
        <IconButton
          className={cn(
            classNames?.triggerClassName,
          )}
          size={triggerSize}
          variant={triggerVariant}
          label={isOpen ? "Close" : "Open"}
        >
          {isOpen ? triggerCloseIcon : triggerIcon}
        </IconButton>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={cn(
          "not-[has-data-[slot=sheet-header]]:pt-12",
          classNames?.contentClassName,
        )}
      >
        {hasHeader && (
          <SheetHeader
            className={cn("w-full", classNames?.headerClassName)}
          >
            <SheetTitle
              className={cn(
                classNames?.titleClassName,
                hideTitle ? "sr-only" : "not-sr-only",
              )}
              hidden={!title}
            >
              {title}
            </SheetTitle>
            <SheetDescription
              className={cn(
                showDescription ? "not-sr-only" : "sr-only",
                classNames?.descriptionClassName,
              )}
              hidden={!description}
            >
              {description}
            </SheetDescription>
          </SheetHeader>
        )}
        {children}
        <SheetFooter className={cn("w-full", classNames?.footerClassName)}>
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

// DashboardLeading
const DashboardLeading: React.FC<
  WithPanelProps<
    Omit<
      React.ComponentPropsWithoutRef<typeof DashboardPanel>,
      "layout" | "position"
    >
  >
> = (
  {
    pinned,
    description,
    title,
    showDescription,
    hideTitle,
    defaultOpen,
    open,
    onOpenChange,
    triggerSize = "icon-lg",
    triggerVariant = "default",
    ...props
  },
) => {
  const isMobile = useIsMobile();
  if (isMobile && !pinned) {
    return (
      <DashboardSheet
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
          triggerClassName: "fixed left-2 bottom-6 z-[99]",
        }}
      >
        <DashboardPanel scrollable layout="expand" {...props} />
      </DashboardSheet>
    );
  }
  return <DashboardPanel position="leading" {...props} />;
};
DashboardLeading.displayName = "DashboardLeading";

export { DashboardLeading, DashboardLeadingPanel };
