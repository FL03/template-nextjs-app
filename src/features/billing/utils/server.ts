/**
 * Created At: 2025.09.14:16:02:58
 * @author - @FL03
 * @directory - src/features/billing/utils
 * @file - server.ts
 */
'use server';
// imports
import Stripe from 'stripe';
// project
import { resolveOrigin } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { stripeServerClient } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';

const origin = resolveOrigin();

export const linkCustomerToUser = async (customerId: string) => {
  const supabase = await createServerClient();
  const stripe = stripeServerClient();
  // fetch the customer to ensure the email matches
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    throw new Error('The provided customerId is invalid.');
  } else {
    await supabase.auth.updateUser({
      data: { customer_email: customer.email },
    });
  }
};

type ItemCheckoutOptions = {
  priceId?: string;
  quantity?: number;
  userId?: string | null;
  username?: string | null;
  customerId?: string;
  returnUrl?: string;
  lookupKey?: string;
};

export const checkoutItemByPrice = async ({
  customerId,
  priceId,
  quantity = 1,
  userId,
  username,
  returnUrl = origin,
  lookupKey,
}: ItemCheckoutOptions = {}): Promise<Stripe.Checkout.Session> => {
  const stripe = stripeServerClient();
  // ensure a customer id or email is provided
  if (!customerId) {
    throw new Error('A valid customer id is required for checkout.');
  }
  if (!priceId && !lookupKey) {
    throw new Error('Either priceId or lookupKey is required.');
  }
  // if a lookup key is provided, fetch the price id
  if (!priceId && lookupKey) {
    // fetch the price id from the lookup key
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      limit: 1,
    });

    if (prices.data.length === 0) {
      throw new Error(`No price found for lookup key: ${lookupKey}`);
    }

    priceId = prices.data[0].id;
  }
  // create the checkout session
  return await stripe.checkout.sessions.create({
    automatic_tax: { enabled: true },
    billing_address_collection: 'auto',
    currency: 'usd',
    customer: customerId,
    customer_update: { address: 'auto' },
    mode: 'subscription',
    ui_mode: 'hosted',
    cancel_url: `${returnUrl}/?canceled=true`,
    success_url: `${returnUrl}/?success=true`,
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    metadata: {
      userId: userId ?? null,
      username: username ?? null,
    },
  });
};

export const createPortalLink = async ({
  customerId,
  returnUrl,
}: {
  customerId?: string;
  returnUrl?: string;
} = {}): Promise<Stripe.BillingPortal.Session> => {
  const stripe = stripeServerClient();
  if (!customerId) {
    throw new Error(
      'A customerId is required for creating a new billing portal session',
    );
  }
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
};

export const getOrCreateCustomer = async (
  email: string,
  {
    metadata,
  }: {
    metadata?: { userId?: string | null; username?: string | null };
  } = {},
): Promise<Stripe.Customer> => {
  const stripe = stripeServerClient();
  let customer: Stripe.Customer | null = null;
  // try to find the customer by email
  const { data: customers } = await stripe.customers.list({
    email,
    limit: 1,
  });
  if (customers.length === 1) {
    logger.info(`Found existing customer for email ${email}`);
    customer = customers[0];
  } else {
    // create a new customer
    customer = await stripe.customers.create({
      email,
      metadata,
    });
  }
  return customer;
};
