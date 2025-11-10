/**
 * Created At: 2025.09.17:10:59:36
 * @author - @FL03
 * @directory - src/app/api/billing
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { stripeServerClient } from "@/lib/stripe";
import { ApiResponse } from "@/types";

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<{ message: string }>> {
  const stripe = stripeServerClient();
  const url = new URL(req.url);
  // extract the customer id from the query params
  const priceId = url.searchParams.get("priceId");

  return NextResponse.json({ data: { message: "/api/stripe" }, error: null }, {
    status: 200,
  });
}
