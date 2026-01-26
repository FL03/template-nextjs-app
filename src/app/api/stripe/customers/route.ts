/**
 * Created At: 2025.09.18:09:10:56
 * @author - @FL03
 * @directory - src/app/api/stripe/customers
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// project
import { logger } from "@/lib/logger";
import { stripeServerClient } from "@/lib/stripe";
import { ApiResponse } from "@/types";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<Stripe.ApiList<Stripe.Customer>>> {
  const stripe = stripeServerClient();
  const { searchParams } = new URL(req.url);
  // extract the customer id from the query params
  const customerEmail = searchParams.get("customerEmail")?.toString();

  const customer = await stripe.customers.list({ email: customerEmail });

  return NextResponse.json({ data: customer, error: null }, {
    status: 200,
  });
}

export async function POST(
  req: NextRequest,
): Promise<ApiResponse<Stripe.Customer>> {
  const stripe = stripeServerClient();
  const supabase = await createServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    logger.error(authError, authError.message);
    return NextResponse.json(
      { data: null, error: authError.message },
      { status: 500 },
    );
  }

  if (!user) {
    logger.error("Unauthorized - No user found");
    return NextResponse.json({
      error: "Unauthorized - No user found",
      data: null,
    });
  }

  const formData = await req.formData();
  const email = formData.get("email")?.toString() || user.email;
  const username: string | null = formData.get("username")?.toString() ??
    user?.user_metadata?.username ?? null;
  const userId = formData.get("userId")?.toString() ?? user?.id ?? null;

  if (!email) {
    logger.error("Missing `email` parameter");
    return NextResponse.json({
      error: "Missing email parameter",
      data: null,
    }, { status: 400 });
  }

  try {
    const customer = await stripe.customers.create({
      email: String(email),
      metadata: {
        userId,
        username,
      },
    });

    // Update Supabase profile with Stripe customer ID
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ customer_id: customer.id })
      .eq("id", String(userId));

    if (dbError) {
      logger.error(dbError, "Database Error (supabase): " + dbError.message);
      return NextResponse.json(
        { data: null, error: dbError.message },
        { status: 500 },
      );
    }

    // add the customer id to the user metadata
    const { error: metaError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { customer_id: customer.id },
      },
    );

    if (metaError) {
      logger.error(
        metaError,
        "Supabase metadata update error: " + metaError.message,
      );
      return NextResponse.json(
        { data: null, error: metaError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { data: customer, error: null },
      { status: 201 },
    );
  } catch (error: unknown) {
    logger.error(error, "Error creating customer: " + String(error));
    return NextResponse.json(
      { data: null, error: error || "Internal Server Error" },
      { status: 500 },
    );
  }
}
