/**
 * Created At: 2025.09.17:11:39:24
 * @author - @FL03
 * @directory - src/lib/stripe
 * @file - helpers.ts
 */

import type { StripeCreds } from "./types";
/** A method for resolving the secret */
export const stripeSecretKey = (): string => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe secret key is missing");
  }
  return secretKey;
};

export const stripePublishableKey = (): string => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("Stripe publishable key is missing");
  }
  return publishableKey;
};

export const loadStripeCredentials = (): StripeCreds => {
  return {
    secretKey: stripeSecretKey(),
    publishableKey: stripePublishableKey(),
  };
};
