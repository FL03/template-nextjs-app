/**
 * Created At: 2025.09.17:11:38:28
 * @author - @FL03
 * @route - /api/stripe/checkout/session
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// project
import { stripeServerClient } from "@/lib/stripe";
import type { ApiResponse } from "@/types/api";

/** Create a new billing portal session and redirect to the session url. */
export async function POST(
  req: NextRequest,
): Promise<ApiResponse<Stripe.BillingPortal.Session>> {
  // get the stripe client
  const stripe = stripeServerClient();
  // handle the request
  const { origin } = new URL(req.url);

  const formData = await req.formData();
  // parse the form data
  const customerId = formData.get("customerId")?.toString() ?? null;
  const returnUrl = formData.get("returnUrl")?.toString() ?? origin;
  // validate the input
  if (!customerId) {
    return NextResponse.json({
      error: "A customerId is required to create a billing portal session",
      data: null,
    }, { status: 400 });
  }
  // create a new billing portal session and redirect to the session url
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  }).then((session) => (
    NextResponse.json({ data: session, error: null }, { status: 200 })
  )).catch((error) => (
    NextResponse.json({
      error: String(error),
      data: null,
    }, { status: 500 })
  ));
}
