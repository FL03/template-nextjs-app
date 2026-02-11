/**
 * Created At: 2025.09.17:11:38:28
 * @author - @FL03
 * @route - /api/stripe/checkout
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { stripeServerClient } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello from Stripe Checkout API' });
}

/** Create a new checkout session from the given parameters and redirect to the associated url. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // setup the stripe client
  const stripe = stripeServerClient();
  const supabase = await createServerClient();
  // parse the request url
  const { origin } = new URL(req.url);
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (!session || authError) {
    logger.warn('You must be logged in to create a checkout session.');
    return redirect(`/login?redirect=${encodeURIComponent(req.url)}`);
  }
  const user = session.user;
  // extract the user params
  const { customerId, customerEmail, userId, username } = {
    customerId: user.user_metadata?.customer_id,
    customerEmail: user.email ?? undefined,
    userId: user.id,
    username: user.user_metadata?.username,
  };
  // load the form data
  const form = await req.formData();
  // parse the formData
  const priceId = form.get('priceId')?.toString();
  const quantity = Number(form.get('quantity')?.toString() ?? '1');
  const returnUrl = form.get('returnUrl')?.toString() ?? origin;
  // validate the form data
  if (!priceId) {
    return NextResponse.json(
      {
        data: null,
        error: 'A valid price id is required for checkout.',
      },
      { status: 400 },
    );
  }
  // define the params for the checkout session
  let params: { customer: string } | { customer_email: string } | null = null;
  if (customerId && customerEmail) {
    params = { customer: customerId };
  } else if (customerId) {
    params = { customer: customerId };
  } else if (customerEmail) {
    params = { customer_email: customerEmail };
  } else {
    return NextResponse.json(
      {
        data: null,
        error:
          'Either a customer id or customer email is required for checkout.',
      },
      { status: 400 },
    );
  }
  // try to create a new checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      ...params,
      automatic_tax: { enabled: true },
      billing_address_collection: 'auto',
      currency: 'usd',
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
    // ensure a session url was returned
    if (!session || !session.url) {
      throw new Error('Failed to create checkout session.');
    }
    // redirect to the session url
    return NextResponse.redirect(session.url, 302);
  } catch (err) {
    return NextResponse.json(
      {
        data: null,
        error: String(err),
      },
      { status: 500 },
    );
  }
}
