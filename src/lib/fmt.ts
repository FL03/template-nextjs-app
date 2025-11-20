/**
 * Created At: 2025.09.16:10:49:45
 * @author - @FL03
 * @directory - src/lib/fmt
 * @file - helpers.ts
 */

type Numeric = number | Number;

type CurrencySymbol =
  | "$"
  | "€"
  | "£"
  | "¥"
  | "₹"
  | "₩"
  | "₽"
  | "₺"
  | "₪"
  | "₫"
  | "₴"
  | "₦"
  | "₲"
  | "₵"
  | "₡"
  | "₸";

type CurrencyLiteral<Sym extends string> = `${Sym}${number}`;

type CurrencyLike = Numeric | CurrencyLiteral<CurrencySymbol>;

export class Currency<T extends CurrencyLike> extends Number {
  constructor(value: T) {
    super(Number(value));
  }

  format(
    locale: Intl.LocalesArgument = "en-us",
    options: Omit<Intl.NumberFormatOptions, "style"> = {
      currency: "USD",
      maximumFractionDigits: 2,
    },
  ) {
    return new Intl.NumberFormat(locale, options).format(this.valueOf());
  }
}
