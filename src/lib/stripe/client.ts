/**
 * Created At: 2025.09.14:16:12:15
 * @author - @FL03
 * @directory - src/lib/stripe
 * @file - client.ts
 */
"use client";
// imports
import {
  loadStripe,
  Stripe,
  StripeConstructorOptions,
} from "@stripe/stripe-js";
// project
import { logger } from "@/lib/logger";
// local
import { stripePublishableKey } from "./config";

let stripePromise: Promise<Stripe | null>;

type ClientOpts = {
  publicKey?: string;
  config?: StripeConstructorOptions;
};

/** A client-side method for initializing and accessing a shared instance of the `Stripe` client for the browser. */
export const stripeBrowserClient = async (
  {
    publicKey = stripePublishableKey(),
    config,
  }: ClientOpts = {},
): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!publicKey || publicKey === "") {
      return Promise.reject(new Error("Stripe public key is missing"));
    }
    stripePromise = loadStripe(publicKey, config);
  }

  return stripePromise.then((client) => {
    if (!client) {
      logger.warn(
        "Unable to initialize the brower-side instance of the `stripe` client.",
      );
    }
    return client;
  });
};
