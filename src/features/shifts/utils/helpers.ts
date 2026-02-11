/**
 * Created At: 2025.09.14:14:18:36
 * @author - @FL03
 * @directory - @/features/shifts/utils
 * @file - helpers.ts
 */
import { sumBy } from '@pzzld/core';
// feature-specific
import { ShiftData } from '../types';

/** compute the average amount of earned tips using the given shifts. */
export function averageTips(records: ShiftData[]): number {
  return totalTips(records) / records.length;
}
/** compute the total amount of earned tips. */
export function totalTips(values: ShiftData[]): number {
  const cashSum = sumBy({ key: 'tips_cash', values });
  const creditSum = sumBy({ key: 'tips_credit', values });
  return cashSum + creditSum;
}

export const normalizeToUTCDate = (value?: Date | string | number): Date => {
  const date = value ? new Date(value) : new Date();
  const utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return new Date(utcDate);
};

export const adjustShiftDate = ({ date, ...values }: ShiftData): ShiftData => {
  return { ...values, date: normalizeToUTCDate(date).toUTCString() };
};

export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export const DAYS_OF_WEEK: Record<number, DayOfWeek> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

type DailyMetrics = {
  day: DayOfWeek;
  average: number;
  count: number;
  total: number;
  totalPercentage?: number;
};
/**
 * Computes the average amount of tips received for each day of the week from an array of shift records.
 */
export const computeDailyTipMetrics = (
  data: ShiftData[],
): Record<DayOfWeek, DailyMetrics> => {
  const dailyTotals = data.reduce(
    (acc, { date, tips_cash: cash = 0, tips_credit: credit = 0 }) => {
      const day = new Date(date).getUTCDay();
      if (!acc[day]) {
        acc[day] = {
          count: 1,
          cash,
          credit,
          total: cash + credit,
        };
      } else {
        acc[day] = {
          count: acc[day].count + 1,
          cash: acc[day].cash + cash,
          credit: acc[day].credit + credit,
          total: acc[day].total + cash + credit,
        };
      }
      return acc;
    },
    {} as Record<
      number,
      {
        count: number;
        cash: number;
        credit: number;
        total: number;
      }
    >,
  );
  // compute the daily averages
  const values = Object.keys(dailyTotals).map((key) => {
    const { total, count } = dailyTotals[Number(key)];
    return {
      day: DAYS_OF_WEEK[Number(key)],
      average: count === 0 ? 0 : total / count,
      count,
      total,
    };
  });
  // format as a record
  return Object.fromEntries(values.map((v) => [v.day, v])) as Record<
    DayOfWeek,
    DailyMetrics
  >;
};

class ShiftMetrics {
  private data: Record<DayOfWeek, DailyMetrics> = Object.fromEntries(
    Object.values(DAYS_OF_WEEK).map((day) => [
      day,
      { day, average: 0, count: 0, total: 0 },
    ]),
  ) as Record<DayOfWeek, DailyMetrics>;

  constructor(shifts: ShiftData[]) {
    this.data = computeDailyTipMetrics(shifts);
  }

  evaluate(shifts: ShiftData[]) {
    this.data = computeDailyTipMetrics(shifts);
  }

  day(day: DayOfWeek): DailyMetrics {
    return this.data[day];
  }

  get DayOfWeek(): Record<DayOfWeek, DailyMetrics> {
    return this.data;
  }

  valueOf(): Record<DayOfWeek, DailyMetrics> {
    return this.data;
  }
}

class ShiftStatistics {}

export { ShiftMetrics, ShiftStatistics };
