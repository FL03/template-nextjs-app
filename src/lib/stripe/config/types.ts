/**
 * Created At: 2025.09.25:17:44:59
 * @author - @FL03
 * @directory - src/lib/stripe/config
 * @file - types.ts
 */
export type ProductPricingOptions = {
  lookupKey: string;
  priceId: string;
  /** The item cost (in cents) */
  cost: number;
  isDefaultPrice?: boolean;
  paymentLinkId?: string;
};

export type StripeSubscriptionConfig = {
  name: string;
  accountId: string;
  productId: string;
  pricingTableId: string;
  currency: string;
  prices: ProductPricingOptions[];
};

export type StripeConfig = {
  amount: number;
  currency: string;
};
/** A type defining a credentials object for the `stripe` api. */
export type StripeCreds = {
  secretKey: string;
  publishableKey: string;
};
