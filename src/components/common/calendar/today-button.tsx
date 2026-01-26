/**
 * Created At: 2025.09.15:18:35:54
 * @author - @FL03
 * @directory - src/components/common/calendar
 * @file - calendar-buttons.tsx
 */
"use client";
// imports
import * as React from "react";
import { CalendarCheckIcon } from "lucide-react";
import { MonthChangeEventHandler } from "react-day-picker";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";

export const TodayButton: React.FC<
  & Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "children" | "onClick" | "classNames"
  >
  & {
    classNames?: ClassNames<"icon" | "label">;
    label?: React.ReactNode;
    onMonthChange?: MonthChangeEventHandler;
  }
> = ({
  onMonthChange,
  classNames,
  label = "Today",
  size = "sm",
  variant = "outline",
  ...props
}) => (
  <Button
    {...props}
    size={size}
    variant={variant}
    onClick={(event) => {
      // clean the event
      event.preventDefault();
      event.stopPropagation();
      // change the month
      onMonthChange?.(new Date());
    }}
  >
    {label && (
      <span
        className={cn(
          size?.startsWith("icon") ? "sr-only" : "not-sr-only",
          classNames?.labelClassName,
        )}
      >
        {label}
      </span>
    )}
    <CalendarCheckIcon className={cn("size-4", classNames?.iconClassName)} />
  </Button>
);
TodayButton.displayName = "TodayButton";

export default TodayButton;
