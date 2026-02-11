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
import { stripeServerClient } from '@/lib/stripe';

/** Create a new billing portal session and redirect to the session url. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // parse the request url
  const url = new URL(req.url);
  const stripe = stripeServerClient();
  // extract the formData
  const form = await req.formData();
  const customerId = form.get('customerId')?.toString() ?? null;
  const returnUrl = form.get('returnUrl')?.toString() ?? url.origin;

  if (!customerId) {
    return NextResponse.json(
      {
        error: 'A customerId is required to create a billing portal session',
      },
      { status: 400 },
    );
  }

  return await stripe.billingPortal.sessions
    .create({
      customer: customerId,
      return_url: returnUrl,
    })
    .then((session) => NextResponse.redirect(session.url, 302))
    .catch((error) =>
      NextResponse.json(
        {
          error: String(error),
        },
        { status: 500 },
      ),
    );
}
