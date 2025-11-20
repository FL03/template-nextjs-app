/**
 * Created At: 2025.09.11:20:39:22
 * @author - @FL03
 * @file - shift-calendar.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames as CalendarClassNames } from "react-day-picker";
import { ClassNames } from "@pzzld/core";
// hooks
import { useModal } from "@/hooks/use-modal";
// projects
import { cn } from "@/lib/utils";
// local
import { ShiftInfoModal } from "./modals";
import { useWorkSchedule } from "../providers";
import { ShiftData } from "../types";
// components
import { TodayButton } from "@/components/common/calendar";
import { Calendar } from "@/components/ui/calendar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export const ShiftCalendar: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof Calendar>,
    | "classNames"
    | "mode"
    | "month"
    | "onDayClick"
    | "onMonthChange"
    | "selected"
  > & {
    calendarClassNames?: CalendarClassNames;
    classNames?: ClassNames<"header" | "title" | "description">;
    description?: React.ReactNode;
    title?: React.ReactNode;
    hideTitle?: boolean;
    showDescription?: boolean;
    locale?: Intl.LocalesArgument;
  }
> = ({
  className,
  classNames,
  calendarClassNames,
  description,
  modifiers,
  modifiersClassNames,
  hideTitle,
  showDescription,
  locale = "en-us",
  title = "Calendar",
  captionLayout = "label",
  navLayout = "after",
  timeZone = "UTC",
  ...props
}) => {
  // hooks
  const modal = useModal();
  // context
  const { data } = useWorkSchedule();
  // states
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [selected, setSelected] = React.useState<ShiftData | null>(null);

  const scope = React.useMemo(() => (
    data.filter(({ date }) => {
      return new Date(date).getMonth() >= currentMonth.getMonth();
    })
  ), [currentMonth, data]);

  const handleMonthChange = (next: Date) => {
    setCurrentMonth((prev) => {
      if (prev === next) {
        return new Date(prev.getFullYear(), prev.getMonth() + 1);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "relative z-auto flex flex-col h-fit w-fit mx-auto",
        className,
      )}
    >
      <section className={cn("px-6 w-full", classNames?.headerClassName)}>
        <Item>
          <ItemContent>
            <ItemTitle
              className={cn(
                "text-lg",
                hideTitle ? "sr-only" : "not-sr-only",
                classNames?.titleClassName,
              )}
              hidden={!title}
            >
              {title}
            </ItemTitle>
            <ItemDescription
              className={cn(
                "text-center",
                showDescription ? "not-sr-only" : "sr-only",
                classNames?.descriptionClassName,
              )}
              hidden={!description}
            >
              {description}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <TodayButton onMonthChange={handleMonthChange} />
          </ItemActions>
        </Item>
      </section>
      <section className="flex flex-1 items-center justify-center h-full w-full relative z-auto px-2">
        <Calendar
          className="bg-transparent text-foreground m-auto relative z-auto"
          mode="single"
          captionLayout={captionLayout}
          navLayout={navLayout}
          month={currentMonth}
          selected={selected ? new Date(selected.date) : undefined}
          timeZone={timeZone}
          onMonthChange={handleMonthChange}
          classNames={{
            root: cn("h-full w-full", calendarClassNames?.root),
            months: cn("w-full", calendarClassNames?.months),
            today: cn(
              "font-extrabold rounded-lg",
              "bg-emerald-100 border border-2 border-emerald-500",
              calendarClassNames?.today,
            ),
            ...calendarClassNames,
          }}
          modifiers={{
            shifts: scope.map(({ date }) => new Date(date)),
            ...modifiers,
          }}
          modifiersClassNames={{
            shifts: cn(
              "bg-secondary text-secondary-foreground border border-secondary font-semibold",
              "transition-none hover:bg-secondary/50 ring-none",
              modifiersClassNames?.shifts,
            ),
            ...modifiersClassNames,
          }}
          onDayClick={(date) => {
            const foundShift = scope.find(
              (item) => (
                new Date(item.date).toISOString() ===
                  new Date(date).toISOString()
              ),
            ) ?? null;
            setSelected(foundShift);
            if (foundShift) modal.open();
          }}
          {...props}
        />
      </section>
      <ShiftInfoModal
        className="max-w-lg"
        value={selected}
        open={modal.isOpen}
        onOpenChange={modal.setIsOpen}
      />
    </div>
  );
};
ShiftCalendar.displayName = "ShiftCalendar";

export default ShiftCalendar;
