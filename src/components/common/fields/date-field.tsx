/**
 * Created At: 2025.10.23:11:43:51
 * @author - @FL03
 * @directory - src/components/common/fields
 * @file - date-field.tsx
 */
"use client";
// imports
import * as React from "react";
import type { ClassNames as CalendarClassNames } from "react-day-picker";
// project
import { cn } from "@/lib/utils";
import { ClassNames } from "@/types";
// components
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const DateField: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof Field>,
    "children" | "defaultValue" | "value"
  > & {
    defaultValue?: Date | string | number;
    value?: Date | string | number;
    label?: string;
    name?: string;
    description?: string;
    classNames?: ClassNames<"calendar" | "description" | "label" | "legend">;
    calendarClassNames?: CalendarClassNames;
    captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"];
    navLayout?: React.ComponentProps<typeof Calendar>["navLayout"];
    timeZone?: string;
    required?: boolean;
    hideLabel?: boolean;
    showDescription?: boolean;
    showFooter?: boolean;
    onValueChange?(date: Date | undefined): void;
  }
> = (
  {
    ref,
    calendarClassNames,
    className,
    classNames,
    description,
    defaultValue,
    value,
    onValueChange,
    hideLabel,
    showDescription,
    showFooter,
    captionLayout,
    required,
    navLayout = "after",
    timeZone = "UTC",
    label = "Date",
    name = "date",
    orientation = "vertical",
    ...props
  },
) => {
  const [selected, setSelected] = React.useState<Date | undefined>(
    () => defaultValue ? new Date(defaultValue) : undefined,
  );
  // synchronize the internal and external states
  React.useEffect(() => {
    if (value && new Date(value).toISOString() !== selected?.toISOString()) {
      setSelected(new Date(value));
    }
  }, [selected, value]);

  const currentValue = React.useMemo<string>(() => (
    selected
      ? `Selected date: ${selected.toLocaleDateString("en-us", { timeZone })}`
      : "No date selected"
  ), [selected, timeZone]);
  return (
    <Field
      ref={ref}
      orientation={orientation}
      className={cn("relative z-auto", className)}
      {...props}
    >
      <FieldContent hidden={hideLabel}>
        <FieldLabel
          htmlFor={name}
          className={cn(
            hideLabel ? "sr-only" : "not-sr-only",
            classNames?.labelClassName,
          )}
        >
          {label}
        </FieldLabel>

        {description && (
          <FieldDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </FieldDescription>
        )}
      </FieldContent>
      <Input
        required={required}
        type="hidden"
        id={name}
        name={name}
        value={selected?.toISOString()}
      />
      <div className="flex flex-1 h-full w-full items-center relative z-auto">
        <Calendar
          mode="single"
          captionLayout={captionLayout}
          navLayout={navLayout}
          className={cn(
            "mx-auto bg-transparent text-foreground",
            classNames?.calendarClassName,
          )}
          classNames={{
            root: cn("static h-auto w-auto", calendarClassNames?.root),
            footer: cn(
              "flex flex-nowrap items-center justify-center w-full",
              "text-sm text-muted-foreground",
              calendarClassNames?.footer,
            ),
            ...calendarClassNames,
          }}
          defaultMonth={value
            ? new Date(value)
            : defaultValue
            ? new Date(defaultValue)
            : undefined}
          selected={selected ?? undefined}
          onSelect={setSelected}
          footer={showFooter ? currentValue : undefined}
          timeZone={timeZone}
        />
      </div>
    </Field>
  );
};
DateField.displayName = "DateField";
