/**
 * Created At: 2025.09.11:20:39:22
 * @author - @FL03
 * @file - shift-calendar.tsx
 */
"use client";
// imports
import * as React from "react";
import { DayEventHandler } from "react-day-picker";
// hooks
import { useModal } from "@/hooks/use-modal";
// projects
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// feature-specific
import { ShiftCalendarModal } from "./modals";
import { useWorkSchedule } from "../providers";
import { ShiftData } from "../types";
// components
import { TodayButton } from "@/components/common/calendar";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ShiftCalendar: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof Calendar>,
    "onDayClick" | "onMonthChange" | "month" | "selected" | "mode"
  > & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    hideTitle?: boolean;
    showDescription?: boolean;
  }
> = ({
  className,
  classNames,
  description,
  modifiers,
  modifiersClassNames,
  hideTitle,
  showDescription,
  title = "Shift Calendar",
  captionLayout = "label",
  navLayout = "after",
  timeZone = "UTC",
  ...props
}) => {
  // use the schedule provider
  const { data } = useWorkSchedule();

  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [selected, setSelected] = React.useState<ShiftData | undefined>(
    undefined,
  );
  const modal = useModal();

  const shifts = React.useMemo(() => (
    data.filter((shift) => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getMonth() === currentMonth.getMonth() ||
        shiftDate > currentMonth;
    })
  ), [data, currentMonth]);

  const handleMonthChange = (next: Date) => {
    setCurrentMonth((prev) => {
      if (prev === next) {
        return new Date(prev.getFullYear(), prev.getMonth() + 1);
      }
      return next;
    });
  };
  // create a callback function handling day clicks
  const handleOnDayClick: DayEventHandler<React.MouseEvent> = (
    date,
  ) => {
    const foundShift = shifts.find(
      ({ date: shiftDate }) => (
        new Date(shiftDate).toISOString() === new Date(date).toISOString()
      ),
    ) ?? null;

    if (!foundShift) return;

    if (foundShift === selected) {
      logger.debug(
        `Shift for date: ${date.toISOString()} is already selected.`,
      );
      modal.close();
      return;
    }

    logger.debug(`Found shift for date: ${date.toISOString()}`);
    setSelected(foundShift);
    modal.open();
  };

  // render the calendar
  return (
    <Card className={cn("w-full items-center", className)}>
      <CardContent className="flex-1 h-full w-full">
        <CardHeader>
          <CardTitle
            className={cn("text-lg", hideTitle ? "sr-only" : "not-sr-only")}
          >
            {title}
          </CardTitle>
          {description && (
            <CardDescription
              className={cn(
                "text-center",
                showDescription ? "not-sr-only" : "sr-only",
              )}
            >
              {description}
            </CardDescription>
          )}
          <CardAction className="flex shrink h-full items-center">
            <TodayButton onMonthChange={handleMonthChange} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-1 items-center h-full w-full relative z-auto">
          <Calendar
            className="bg-transparent text-foreground w-full m-auto"
            mode="single"
            captionLayout={captionLayout}
            navLayout={navLayout}
            month={currentMonth}
            selected={selected ? new Date(selected.date) : undefined}
            onMonthChange={handleMonthChange}
            onDayClick={handleOnDayClick}
            timeZone={timeZone}
            classNames={{
              root: cn("static h-auto w-auto", classNames?.root),
              months: cn("w-full", classNames?.months),
              today: cn(
                "bg-primary text-primary-foreground",
                classNames?.today,
              ),
              ...classNames,
            }}
            modifiers={{
              shifts: shifts.map(({ date }) => new Date(date)),
              ...modifiers,
            }}
            modifiersClassNames={{
              shifts: cn(
                "bg-secondary/75 text-secondary-foreground border border-secondary/15 font-semibold",
                "transition-none hover:bg-secondary/50 ring-none",
                modifiersClassNames?.shifts,
              ),
              ...modifiersClassNames,
            }}
            {...props}
          />
        </CardFooter>
      </CardContent>
      <ShiftCalendarModal
        className="max-w-lg"
        selected={selected}
        open={modal.isOpen}
        onOpenChange={modal.setIsOpen}
      />
    </Card>
  );
};
ShiftCalendar.displayName = "ShiftCalendar";

export default ShiftCalendar;
