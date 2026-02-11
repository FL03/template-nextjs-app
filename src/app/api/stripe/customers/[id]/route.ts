/**
 * Created At: 2025.09.18:09:10:56
 * @author - @FL03
 * @directory - src/app/api/stripe/customers
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// project
import { logger } from '@/lib/logger';
import { stripeServerClient } from '@/lib/stripe';
import type { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<Stripe.Customer | Stripe.DeletedCustomer>> {
  const stripe = stripeServerClient();
  const url = new URL(req.url);
  // extract the customerId from the pathname
  const customerId = url.pathname.split('/').pop();
  if (!customerId) {
    logger.error('Missing `customerId` parameter');
    return NextResponse.json(
      { error: 'Missing customerId parameter', data: null },
      { status: 400 },
    );
  }
  // extract any additional query parameters if needed

  const customer = await stripe.customers.retrieve(customerId);
  return NextResponse.json(
    { data: customer, error: null },
    {
      status: 200,
    },
  );
}
