/**
 * Created At: 2025.09.25:18:40:02
 * @author - @FL03
 * @directory - src/app/api/stripe/prices
 * @file - route.ts
 */
"use server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// project
import { stripeServerClient } from "@/lib/stripe";
import { ApiResponse } from "@/types";
import { logger } from "@/lib/logger";

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<Stripe.Price[]>> {
  // setup the stripe client
  const stripe = stripeServerClient();
  // handle the request
  const { searchParams } = new URL(req.url);
  const active = searchParams.get("active") === "true" ? true : undefined;
  const product = searchParams.get("product")?.toString() ?? undefined;
  const lookup_keys = searchParams.getAll("lookup_keys");
  const queryLimit = searchParams.get("limit")?.toString();

  const limit = queryLimit && queryLimit !== "all"
    ? parseInt(queryLimit, 10)
    : 10;

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json({
      data: null,
      error: "Limit must be a number between 1 and 100.",
    }, { status: 400 });
  }

  if (lookup_keys.length > 10) {
    return NextResponse.json({
      data: null,
      error: "You can only filter by up to 10 lookup keys at a time.",
    }, { status: 400 });
  }

  try {
    // fetch the prices from stripe
    const { data } = await stripe.prices.list({
      active,
      product,
      lookup_keys: lookup_keys.length > 0 ? lookup_keys : undefined,
      limit,
      expand: ["data.product"],
    });
    return NextResponse.json({ data, error: null }, { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error(error, error.message);
    return NextResponse.json({
      data: null,
      error: "Unable to retrieve the prices: " + String(err),
    }, { status: 500 });
  }
}
