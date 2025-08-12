/**
 * Created At: 2025.07.14:09:19:32
 * @author - @FL03
 * @file - dashboard-drawer.tsx
 */
"use client";
// import
import * as React from "react";
import { ArrowBigDownDashIcon, ArrowBigUpDashIcon } from "lucide-react";
// project
import { cn } from "@/lib/utils";
// components
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
// local
import { TriggeredModalProps } from "./types";
import { useModal } from "@/hooks/use-modal";

export const DashboardDrawer: React.FC<
  React.PropsWithChildren<TriggeredModalProps> & {
    className?: string;
  }
> = ({
  children,
  className,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  triggerClassName,
  triggerIcon = <ArrowBigUpDashIcon className="h-8 w-8" />,
  triggerCloseIcon = <ArrowBigDownDashIcon className="h-8 w-8" />,
  showTriggerLabel,
}) => {
  
  const { isOpen, setIsOpen, } = useModal({
    defaultOpen,
    open: openProp,
    onOpenChange,
  });
  // render the Sidebar component
  return (
    <Drawer
      defaultOpen={defaultOpen}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger
        className={cn(
          "inline-flex w-fit h-fit rounded-full p-2 gap-2",
          "bg-transparent text-foreground border border-accent transition-all hover:opacity-80",
          triggerClassName,
        )}
      >
        {isOpen ? triggerCloseIcon : triggerIcon}
        <span className={showTriggerLabel ? "not-sr-only" : "sr-only"}>
          {isOpen ? "Close" : "Open"}
        </span>
      </DrawerTrigger>
      <DrawerContent
        className={cn("flex flex-col w-full gap-2 px-4 pt-6 pb-2", className)}
      >
        {children}
      </DrawerContent>
    </Drawer>
  );
};
DashboardDrawer.displayName = "DashboardDrawer";

export default DashboardDrawer;
