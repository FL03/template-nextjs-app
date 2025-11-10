/**
 * Created At: 2025.09.12:19:34:30
 * @author - @FL03
 * @file - server.ts
 */
import { Stripe } from "stripe";
import { stripeSecretKey } from "./config";

let stripeInstance: Stripe | null = null;

/** A server-side method for accessing the `stripe` api via a shared, lazily-loaded instance of the `Stripe` client. */
export const stripeServerClient = (
  clientSecret: string = stripeSecretKey(),
  config: Stripe.StripeConfig = {
    stripeAccount: process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID,
  },
): Stripe => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(clientSecret, config);
  }
  return stripeInstance;
};

export const initCheckoutSession = async (
  options?: Stripe.Checkout.SessionCreateParams,
): Promise<
  Stripe.Checkout.Session
> => {
  const stripe = stripeServerClient();
  return await stripe.checkout.sessions.create(options);
};
