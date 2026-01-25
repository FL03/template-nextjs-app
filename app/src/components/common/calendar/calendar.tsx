/**
 * Created At: 2025.09.15:18:38:02
 * @author - @FL03
 * @directory - src/components/common/calendar
 * @file - calendar.tsx
 */
"use client";
// imports
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ClassNames, DayPicker } from "react-day-picker";
// project
import { cn } from "@/lib/utils";
// components
import { Button, buttonVariants } from "@/components/ui/button";
// local
import { TodayButton } from "./today-button";

type CalendarClasses = Partial<ClassNames>;

const calendarClasses = ({ classNames }: { classNames?: CalendarClasses }) => {
  return {
    ...classNames,
    caption_label: cn("font-semibold text-medium", classNames?.caption_label),
    day: cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "rounded-none transition-colors min-w-8 max-w-16 flex-1",
      "aria-selected:bg-secondary/80 aria-selected:text-secondary-foreground/80",
    ),
    disabled: cn("text-muted-foreground opacity-50", classNames?.disabled),
    hidden: cn("invisible", classNames?.hidden),
    month: cn("month", classNames?.month),
    months: cn("relative", classNames?.months),
    month_caption: cn(
      "inline-flex items-center justify-start my-2",
      classNames?.month_caption,
    ),
    month_grid: cn("month-grid w-full", classNames?.month_grid),
    outside: cn(
      "day-outside text-secondary-foreground",
      "aria-selected:bg-secondary/50 aria-selected:text-muted-foreground",
      classNames?.outside,
    ),
    range_middle: cn(
      "aria-selected:bg-secondary aria-selected:text-secondary-foreground ",
      classNames?.range_middle,
    ),
    selected: cn(
      "bg-secondary/80 text-secondary-foreground rounded-none",
      "hover:bg-secondary/90 hover:text-secondary-foreground hover:opacity-50",
      "focus:ring focus:ring-ring focus:outline-none focus:ring-inset",
      classNames?.selected,
    ),
    today: cn(
      "bg-secondary text-secondary-foreground border-none rounded-none",
      "hover:bg-secondary/80 hover:text-secondary-foreground/80 hover:border-secondary/80",
      "focus:ring focus:ring-ring focus:outline-none focus:ring-inset",
      classNames?.today,
    ),
    weekday: cn(
      "relative inline-flex items-center justify-start",
      "font-semibold text-pretty text-inherit",
      classNames?.weekday,
    ),
    weekdays: cn(
      "flex flex-1 flex-row flex-nowrap items-center justify-around",
      "text-sm text-foreground",
      classNames?.weekdays,
    ),
  };
};

export const CustomCalendar: React.FC<
  React.ComponentProps<typeof DayPicker> & { defaultMonth?: Date }
> = ({
  className,
  classNames,
  defaultMonth = new Date(),
  showOutsideDays = true,
  ...props
}) => {
  const [month, setMonth] = React.useState<Date | undefined>(defaultMonth);

  const CalendarFooter: React.FC<{ showToday?: boolean }> = ({
    showToday = true,
  }) => (
    <div className="flex flex-nowrap items-center w-full gap-1">
      {showToday && (
        <TodayButton
          className="absolute bottom-0 left-0"
          onMonthChange={setMonth}
        />
      )}
      {month && (
        <div className="inline-flex flex-nowrap justify-end gap-2 items-center ">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      )}
    </div>
  );
  return (
    <DayPicker
      hideNavigation
      className={cn("relative z-auto block h-fit w-fit min-w-sm", className)}
      classNames={calendarClasses({ classNames })}
      month={month}
      onMonthChange={setMonth}
      showOutsideDays={showOutsideDays}
      footer={<CalendarFooter showToday />}
      {...props}
    />
  );
};
CustomCalendar.displayName = "Calendar";

export default CustomCalendar;
