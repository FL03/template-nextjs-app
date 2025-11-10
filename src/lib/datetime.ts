/**
 * Created At: 2025-04-04:19:23:31
 * @author - @FL03
 * @description - datetime utilities for the platform
 * @file - utils.ts
 */
import { TZDate } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";

/** A type defining a string enumeration */
export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/** A constant list of days in the week */
export const DAYS_OF_WEEK: Record<number, DayOfWeek> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export type WeekMap<TValue> =
  | Record<DayOfWeek, TValue>
  | { [key in DayOfWeek]: TValue }
  | { [key in DayOfWeekIndex]: TValue };

export interface Time {
  hour: number;
  minute: number;
}
/** `DateLike` defines the various _types_ a date may take. */
export type DateLike = Date | number | string;

export enum Days {
  Sunday = "sunday",
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
}

export class Day extends Date {
  constructor(value?: string | number | Date) {
    value ??= new Date();
    super(value);
  }

  getDayOfWeek(): DayOfWeek {
    return DAYS_OF_WEEK[this.getDay() % 7];
  }
}

export const coerceUtcDate = (value?: string | number | Date) => {
  const date = new Date(value ?? Date.now());
  return new UTCDate(date);
};

export const dateWithTimezone = (
  value?: string | number | Date,
  timezone: string = "America/Chicago",
) => {
  const date = value ? new Date(value) : new Date();
  return new TZDate(date, timezone);
};

export const coerceAnyDate = (value?: any | null) => {
  if (!value) return null;
  return new Date(value);
};

/** This method tries to resolve the input into a particular DayLiteral */
export const resolveDayLiteral = (day: string): DayOfWeek => {
  const formattedDay = day.trim().toLowerCase();
  if (formattedDay.startsWith("sun")) return "Sunday";
  else if (formattedDay.startsWith("mon")) return "Monday";
  else if (formattedDay.startsWith("tue")) return "Tuesday";
  else if (formattedDay.startsWith("wed")) return "Wednesday";
  else if (formattedDay.startsWith("thu")) return "Thursday";
  else if (formattedDay.startsWith("fri")) return "Friday";
  else if (formattedDay.startsWith("sat")) return "Saturday";
  else {
    throw new Error(`Invalid day: ${day}`);
  }
};

export const stringToDay = (day: string): Days | null => {
  switch (day.toLowerCase()) {
    case "sunday":
      return Days.Sunday;
    case "monday":
      return Days.Monday;
    case "tuesday":
      return Days.Tuesday;
    case "wednesday":
      return Days.Wednesday;
    case "thursday":
      return Days.Thursday;
    case "friday":
      return Days.Friday;
    case "saturday":
      return Days.Saturday;

    default:
      return null;
  }
};
