/**
 * Created At: 2025.09.19:07:56:04
 * @author - @FL03
 * @directory - src/lib/stripe
 * @file - consts.ts
 */

/** Define the default price for a monthly subscription (in cents) */
export const DEFAULT_AMOUNT_CENTS: number = 150; // Default amount in cents ($1.00)
/** The default currency */
export const DEFAULT_CURRENCY: string = 'usd'; // Default currency
/**  */
export const DEFAULT_CHECKOUT_RETURN_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const STRIPE_PRODUCT_ID = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID;
export const STRIPE_PRICING_TABLE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID;

export const defaultStripePriceId = ({
  defaultValue = 'price_1S9byjEyVRqBnIeEvgV6LCjz',
  key = 'NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID',
}: {
  defaultValue?: string;
  key?: string;
} = {}): string => process.env[key] || defaultValue;
