/**
 * Created At: 2025.09.16:09:52:33
 * @author - @FL03
 * @directory - src/features/shifts/widgets
 * @file - shift-calendar-modal.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// local
import { DeleteShiftButton, ShiftLinkButton } from "../actions";
import { ShiftTips } from "../shift-tips";
import type { ShiftData } from "../../types";
// components
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const ShiftCalendarDialog: React.FC<
  & React.ComponentPropsWithoutRef<typeof Dialog>
  & React.PropsWithChildren<{ className?: string; selected?: ShiftData | null }>
> = ({ children, className, selected, ...props }) => (
  <Dialog {...props}>
    {children && <DialogTrigger asChild>{children}</DialogTrigger>}
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {selected
            ? new Date(selected?.date).toLocaleDateString("en-us", {
              timeZone: "UTC",
            })
            : "Shift"}
        </DialogTitle>
        <DialogDescription>
          View the earned tips for this shift.
        </DialogDescription>
      </DialogHeader>
      <div
        className={cn(
          "flex flex-1 flex-col h-full w-full overflow-y-auto",
          className,
        )}
      >
        <ShiftTips
          cashTips={selected?.tips_cash}
          cardTips={selected?.tips_credit}
        />
        <DialogFooter className="flex flex-nowrap items-center justify-center w-full">
          <ButtonGroup>
            <ShiftLinkButton itemId={selected?.id} />
            <DeleteShiftButton itemId={selected?.id} />
          </ButtonGroup>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);

const ShiftCalendarDrawer: React.FC<
  & React.ComponentPropsWithoutRef<typeof Drawer>
  & React.PropsWithChildren<{ className?: string; selected?: ShiftData | null }>
> = ({ children, className, selected, ...props }) => (
  <Drawer {...props}>
    {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
          {selected
            ? new Date(selected.date).toLocaleDateString("en-us", {
              timeZone: "UTC",
            })
            : "Shift"}
        </DrawerTitle>
        <DrawerDescription>
          View the earned tips for this day.
        </DrawerDescription>
      </DrawerHeader>
      <div
        className={cn(
          "flex flex-1 flex-col h-full w-full overflow-y-auto",
          className,
        )}
      >
        <ShiftTips
          cashTips={selected?.tips_cash}
          cardTips={selected?.tips_credit}
        />
        <DrawerFooter className="flex flex-nowrap items-center justify-center w-full">
          <ButtonGroup>
            <ShiftLinkButton itemId={selected?.id} />
            <DeleteShiftButton itemId={selected?.id} />
          </ButtonGroup>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);

export const ShiftCalendarModal: React.FC<
  React.PropsWithChildren<{
    className?: string;
    selected?: ShiftData | null;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
  }>
> = (
  {
    selected,
    ...props
  },
) => {
  const isMobile = useIsMobile();
  if (!selected) return null;

  if (isMobile) {
    return <ShiftCalendarDrawer {...props} selected={selected} />;
  } else {
    return <ShiftCalendarDialog {...props} selected={selected} />;
  }
};
ShiftCalendarModal.displayName = "ShiftCalendarModal";
