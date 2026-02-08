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

export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeekMap<TDays extends string | number | symbol = Days, TValue = any> = { [key in TDays]: TValue };

export interface Time {
  hour: number;
  minute: number;
}
/** `DateLike` defines the various _types_ a date may take. */
export type DateLike = Date | number | string;

export enum Days {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
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
