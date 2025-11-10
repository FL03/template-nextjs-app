/**
 * Created At: 2025.09.16:10:49:45
 * @author - @FL03
 * @directory - src/lib/fmt
 * @file - helpers.ts
 */

type Numeric = number | `${number}` | Number | string;

type PropsWithPrecision<T = {}> = T & { precision?: number };

type FormatAsOptions =
  | PropsWithPrecision<{ format?: "number" | "percent" | "currency" }>
  | {
    format?: "date";
  };

/** A method for formatting a variable as a currency */
export function formatAsCurrency<T extends Numeric>(
  value?: T | null,
  options?: PropsWithPrecision<{ currency?: string }>,
): string {
  const { currency = "USD", precision = 2 } = options || {};
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: precision,
  }).format(Number(value ?? 0));
}

export function formatAsPercent<T extends Numeric>(
  value?: T | null,
  { precision }: PropsWithPrecision = { precision: 2 },
): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: precision,
  }).format(Number(value ?? 0));
}
/** A method for converting the given value into a particular string _format_. */
export function formatNumberAs<T extends Numeric>(
  value?: T | null,
  { mode, placeholder = "-", precision = 2 }: {
    mode?: string;
    placeholder?: string;
    precision?: number;
  } = {},
): string {
  const data = Number(value);
  if (!data || data === null || isNaN(data)) {
    return placeholder;
  }

  let fmt = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: precision,
  });
  if (mode === "currency") {
    fmt = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "usd",
      maximumFractionDigits: precision,
    });
  } else if (mode === "percent") {
    new Intl.NumberFormat("en-us", {
      style: "percent",
      maximumFractionDigits: precision,
    });
  }
  return fmt.format(data);
}

type DataFormats = "number" | "currency" | "percent" | "date";

export class FormatAs<T> {
  private _value: number;

  constructor(value: T) {
    this._value = Number(value);
  }

  valueOf(): number {
    return this._value;
  }

  asCurrency(options?: PropsWithPrecision<{ currency?: string }>) {
    return formatAsCurrency(this.valueOf(), options);
  }

  asPercent(options?: PropsWithPrecision) {
    return formatAsPercent(this.valueOf(), options);
  }

  asNumber(options?: PropsWithPrecision) {
    const { precision = 2 } = options || {};
    return this.valueOf().toFixed(precision);
  }

  asDateString(
    { locale = "en-us", timeZone = "UTC", ...options }: {
      locale?: Intl.LocalesArgument;
    } & Partial<Intl.DateTimeFormatOptions> = {},
  ) {
    return new Date(this.valueOf()).toLocaleDateString(locale, {
      timeZone,
      ...options,
    });
  }

  formatAs<Style extends DataFormats>(
    style: Style,
    options?: Style extends "date" ? { timeZone?: string; locale?: string }
      : PropsWithPrecision<
        Style extends "currency" ? { currency?: string } : {}
      >,
  ) {
    if (style === "date") {
      return this.asDateString();
    }
    if (style === "currency") {
      return this.asCurrency(
        options as PropsWithPrecision<{ currency?: string }>,
      );
    } else if (style === "percent") {
      return this.asPercent(options as PropsWithPrecision);
    } else if (style === "date") {
      return this.asDateString();
    } else {
      return this.asNumber(options as PropsWithPrecision);
    }
  }
}
