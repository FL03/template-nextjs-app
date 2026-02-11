/**
 * Created At: 2025.09.25:18:45:25
 * @author - @FL03
 * @directory - src/app/api/stripe/prices/[id]
 * @file - route.ts
 */
'use server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// project
import { stripeServerClient } from '@/lib/stripe';
import { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<Stripe.Price>> {
  // setup the stripe client
  const stripe = stripeServerClient();
  // handle the request
  const { pathname } = new URL(req.url);
  // extract the necessary params
  const priceId = pathname.split('/').pop();
  if (!priceId) {
    return NextResponse.json(
      { data: null, error: 'Price ID is required.' },
      {
        status: 400,
      },
    );
  }
  try {
    const price = await stripe.prices.retrieve(priceId);
    return NextResponse.json({ data: price, error: null }, { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return NextResponse.json(
      {
        data: null,
        error: 'Unable to retrieve the price: ' + error.message,
      },
      { status: 500 },
    );
  }
}
