/**
 * Created At: 2025.10.24:22:59:23
 * @author - @FL03
 * @directory - src/features/billing/utils
 * @file - api.ts
 */
// imports
import { redirect } from 'next/navigation';
import type Stripe from 'stripe';
// project
import { type ProfileData } from '@/features/profiles';
import { parseSearchParams, resolveOrigin } from '@/lib/utils';
import { logger } from '@/lib/logger';

/** A client-side method that leverages the configured endpoint to create a new stripe customer */
export const createCustomerForCurrentUser = async (
  params?: {
    customerEmail?: string;
    username?: string;
  },
  init?: Omit<RequestInit, 'body' | 'method'>,
): Promise<Stripe.Customer | null> => {
  const res = await fetch('/api/stripe/customers', {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    body: params ? JSON.stringify(params) : undefined,
  });

  const { data, error } = await res.json();

  if (error) {
    logger.error('Unable to create a new customer object on stripe: ' + error);
    return null;
  }
  return data;
};
/** A client-side method for creating a new stripe checkout session object using the configured endpoint. */
export const createCheckoutSession = async (
  values?: {
    customerEmail?: string;
    customerId?: string;
    quantity?: number;
    priceId?: string;
    userId?: string;
    username?: string;
  },
  init?: Omit<RequestInit, 'body' | 'method'>,
): Promise<Stripe.Checkout.Session> => {
  const res = await fetch('/api/stripe/checkout/session', {
    ...init,
    method: 'POST',
    headers: {
      ...init?.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: values ? JSON.stringify(values) : undefined,
  });

  const { data, error } = await res.json();

  if (error) {
    throw new Error(error);
  }
  if (!data) {
    throw new Error('No checkout session data returned from the server...');
  }
  return data;
};

type CheckoutWorkflowOptions = {
  profile?: ProfileData;
  priceId?: string;
};

export const initCheckoutWorkflow = async ({
  profile,
  priceId = process.env.NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID,
}: CheckoutWorkflowOptions): Promise<Stripe.Checkout.Session> => {
  if (!profile) {
    logger.error('No profile found for the current user...');
    redirect('/auth/login?redirect=/checkout');
  }
  // if no customerId, create one
  if (!profile.customer_id) {
    const newCustomer = await createCustomerForCurrentUser({
      customerEmail: profile.primary_email,
      username: profile.username,
    });
    if (!newCustomer) {
      throw new Error('Unable to create a new customer on stripe...');
    }
    profile.customer_id = newCustomer.id;
  }
  // create a new checkout session
  const session = await createCheckoutSession({
    customerId: profile.customer_id,
    priceId,
    userId: profile.id,
    username: profile.username,
  });
  if (!session) {
    throw new Error('Unable to create a new checkout session on stripe...');
  }
  return session;
};

export const fetchPrice = async (
  { priceId }: { priceId?: string } = {},
  init?: Omit<RequestInit, 'method'>,
): Promise<Stripe.Price> => {
  const url = new URL(`/api/stripe/prices/${priceId}`, resolveOrigin());
  const res = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const { data, error } = await res.json();

  if (error) {
    logger.error('Unable to fetch price from the server: ' + error);
    throw new Error(error);
  }
  if (!data) {
    logger.error('No price data returned from the server...');
    throw new Error('No price data returned from the server...');
  }
  return data;
};

export const fetchPrices = async (
  { active, lookup_keys }: { active?: boolean; lookup_keys?: string[] } = {},
  init?: Omit<RequestInit, 'method'>,
): Promise<Stripe.Price[]> => {
  const url = new URL('/api/stripe/prices', resolveOrigin());
  url.search = parseSearchParams({ active, lookup_keys }).toString();
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });
  const { data, error } = await res.json();

  if (error) {
    logger.error('Unable to fetch price from the server: ' + error);
    throw new Error(error);
  }
  if (!data) {
    logger.error('No price data returned from the server...');
    throw new Error('No price data returned from the server...');
  }
  return data;
};

export const fetchProduct = async (
  params?: { productId?: string },
  init?: Omit<RequestInit, 'method'>,
): Promise<Stripe.Product | null> => {
  const url = new URL(
    `/api/stripe/products/${params?.productId}`,
    resolveOrigin(),
  );
  const res = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const { data, error } = await res.json();
  if (error) {
    logger.error('Unable to fetch product from the server: ' + error);
    throw new Error(error);
  }
  if (!data) {
    logger.error('No product data returned from the server...');
    return null;
  }
  return data;
};

export const fetchProducts = async (
  params?: { active?: boolean; limit?: number | `${number}` },
  init?: Omit<RequestInit, 'method'>,
): Promise<Stripe.Product[] | null> => {
  const url = new URL('/api/stripe/products', resolveOrigin());
  url.search = parseSearchParams(params).toString();
  const res = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const { data, error } = await res.json();
  if (error) {
    logger.error('Unable to fetch product from the server: ' + error);
    throw new Error(error);
  }
  if (!data) {
    logger.error('No product data returned from the server...');
    return null;
  }
  return data;
};
