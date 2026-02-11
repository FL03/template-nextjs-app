/**
 * Created At: 2025.09.17:11:38:28
 * @author - @FL03
 * @route - /api/stripe/checkout/session
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { stripeServerClient } from '@/lib/stripe';
// types
import type Stripe from 'stripe';
import { ApiResponse } from '@/types';

type CheckoutFormData = {
  customerEmail?: string;
  customerId?: string;
  priceId?: string;
  quantity?: number;
  returnUrl?: string;
  userId?: string;
  username?: string;
};

/** Create a stripe checkout session and redirect to the session url. */
export async function POST(
  req: NextRequest,
): Promise<ApiResponse<Stripe.Checkout.Session>> {
  // initialize the stripe client
  const stripe = stripeServerClient();
  // parse the request url
  const { origin } = new URL(req.url);
  // load the form data
  let {
    customerEmail,
    customerId,
    priceId,
    quantity = 1,
    returnUrl = origin,
    userId,
    username,
  } = await req.json().then((res) => res as CheckoutFormData);

  if (!customerId && customerEmail) {
    // try to find an existing customer with the given email
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      // create a new customer with the given email
      const newCustomer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId: userId ?? null,
          username: username ?? null,
        },
      });
      customerId = newCustomer.id;
    }

    if (!customerId) {
      logger.error('Failed to find or create a customer for checkout.');
      return NextResponse.json(
        {
          data: null,
          error: 'Failed to find or create a customer for checkout.',
        },
        { status: 500 },
      );
    }
  }

  try {
    // create a new checkout session
    const session = await stripe.checkout.sessions.create({
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
    if (!session) {
      return NextResponse.json(
        {
          data: session,
          error: 'Unable to create stripe checkout session.',
        },
        { status: 500 },
      );
    }
    return NextResponse.json({ data: session, error: null }, { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error(error, error.message);
    return NextResponse.json(
      {
        data: null,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
