/**
 * Created At: 2025.11.13:21:41:03
 * @author - @FL03
 * @directory - packages/core/src/utils
 * @file - fmt.ts
 */

type Numeric = number | `${number}` | Number | string;

type WithLocale<T = {}> = T & { locale?: Intl.LocalesArgument; };

/** 
 * Format the given value as a locale date string configure with the given options. 
 * @returns {string} The formatted date string.
 */
export function formatAsDate<T extends Date | string | number>(
  value: T,
  { locale = "en-us", timeZone = "UTC", ...options }: WithLocale<Intl.DateTimeFormatOptions> = {},
): string {
  return new Date(value).toLocaleDateString(locale, { timeZone, ...options });
}


/** A method for formatting a variable as a currency */
export function formatAsCurrency<T extends Numeric>(
  value?: T | null,
  { locale = "en-us", currency = "USD", maximumFractionDigits = 2, ...options }: WithLocale<Omit<Intl.NumberFormatOptions, "style">> = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
    ...options
  }).format(Number(value ?? 0));
}

export function formatAsPercent<T extends Numeric>(
  value?: T | null,
  { locale = "en-us", maximumFractionDigits = 2, ...opts }: WithLocale<Omit<Intl.NumberFormatOptions, "style">> = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits,
    ...opts
  }).format(Number(value ?? 0));
}


type FormatNumAsProps = WithLocale<{ placeholder?: string; }> & ({
  style?: Intl.NumberFormatOptions["style"];
  options?: Intl.NumberFormatOptions;
} | {
  style: "date";
  locale?: Intl.LocalesArgument;
  options?: {
    timeZone?: Intl.DateTimeFormatOptions["timeZone"];
  };
});

/** 
 * A method for converting the given value into a particular string _format_. 
 * @returns {string} A formatted string representation of the number or date.
 */
export function formatNumAs<T extends Numeric>(
  value?: T | null,
  { options, locale = "en-us", placeholder = "-", style = "decimal", }: FormatNumAsProps = {},
): string {
  if (!value || Number.isNaN(value)) return placeholder;
  if (style === "date") {
    return new Date(Number(value)).toLocaleDateString(locale, { ...options });
  } else {
    return new Intl.NumberFormat(locale, { style, ...options }).format(Number(value));
  }
}
