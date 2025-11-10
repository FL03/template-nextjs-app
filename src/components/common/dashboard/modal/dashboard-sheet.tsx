/**
 * Created At: 2025.07.14:09:19:11
 * @author - @FL03
 * @file - dashboard-sheet.tsx
 */
"use client";
// import
import * as React from "react";
import { MenuIcon, XIcon } from "lucide-react";
// project
import { cn } from "@/lib/utils";
// components
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// local
import { ModalPropsWithTrigger } from "./types";
import { useModal } from "@/hooks/use-modal";

/** The `DashboardSheet` component is designed to wrap the leading dashboard panel so that it may be dynamically _hidden_ using this widget. */
export const DashboardSheet: React.FC<
  React.PropsWithChildren<ModalPropsWithTrigger> & {
    className?: string;
    side?: "top" | "right" | "bottom" | "left";
  }
> = ({
  className,
  children,
  defaultOpen,
  open: openProp,
  onOpenChange,
  side = "left",
  triggerClassName,
  triggerIcon = <MenuIcon className="h-8 w-8" />,
  triggerCloseIcon = <XIcon className="h-8 w-8" />,
  showTriggerLabel,
}) => {
  const { isOpen, setIsOpen } = useModal({
    defaultOpen,
    open: openProp,
    onOpenChange,
  });
  // render the Sidebar component
  return (
    <Sheet
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={setIsOpen}
    >
      <SheetTrigger
        className={cn(
          "inline-flex items-center transition-all",
          "gap-2 p-2 h-fit w-fit rounded-full",
          triggerClassName,
        )}
      >
        {isOpen ? triggerCloseIcon : triggerIcon}
        <span className={showTriggerLabel ? "not-sr-only" : "sr-only"}>
          {isOpen ? "Close" : "Open"}
        </span>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={cn(
          "flex flex-col flex-1 h-full gap-2 px-4 pt-10 pb-2 w-fit max-w-sm",
          className,
        )}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};
DashboardSheet.displayName = "DashboardSheet";
