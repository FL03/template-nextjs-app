/**
 * Created At: 2025.09.25:17:44:09
 * @author - @FL03
 * @directory - src/lib/stripe/config
 * @file - options.ts
 */
import { DEFAULT_AMOUNT_CENTS, DEFAULT_CURRENCY } from "./consts";
import { stripeSecretKey } from "./helpers";
import type { StripeConfig } from "./types";

type PropsWithSecret<T = {}> = T & { clientSecret: string };

/** create a basic object for configuring the stripe api */
export const stripeConfig = (
  values?: Partial<StripeConfig>,
): StripeConfig => ({
  amount: values?.amount || DEFAULT_AMOUNT_CENTS,
  currency: values?.currency || DEFAULT_CURRENCY,
});

export const loadOptions = (
  options?: Partial<PropsWithSecret<StripeConfig>>,
): PropsWithSecret<StripeConfig> => {
  const { clientSecret = stripeSecretKey() } = options || {};
  return {
    amount: 150, // Amount in cents
    clientSecret,
    currency: "usd",
  };
};