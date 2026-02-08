/**
 * Created At: 2025.08.05:19:41:38
 * @author - @FL03
 * @file - types.ts
 */

/** The standard _**type**_ associated with various clock components */
export type ClockProps = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  onTimeChange?: (data?: number | string | Date) => void;
};
