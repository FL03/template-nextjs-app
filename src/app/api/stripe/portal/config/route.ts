/**
 * Created At: 2025.09.17:10:59:36
 * @author - @FL03
 * @directory - src/app/api/billing
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// project
import { stripeServerClient } from '@/lib/stripe';
import { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<Stripe.BillingPortal.Configuration>> {
  // connect to the server client
  const stripe = stripeServerClient();
  // setup the portal configuration
  try {
    const portalConfig = await stripe.billingPortal.configurations.create({
      features: {
        invoice_history: {
          enabled: true,
        },
      },
    });
    return NextResponse.json(
      { data: portalConfig, error: null },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json({ data: null, error }, { status: 500 });
  }
}
