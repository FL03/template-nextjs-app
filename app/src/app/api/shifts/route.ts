/**
 * Created At: 2025.09.10:08:09:58
 * @author - @FL03
 * @file - route.ts
 * @endpoint - /api/shifts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";
import { ShiftData } from "@/features/shifts";
// types
import type { Database } from "@/types/database.types";
import type { ApiResponse } from "@/types";

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<ShiftData[]>> {
  // initialize a supabase client
  const supabase = await createServerClient<Database, "rms">("rms");
  // deconstruct the parsed url
  const { searchParams } = new URL(req.url);
  // extract the necessary query params
  const { filterBy, limit, sortBy } = {
    filterBy: searchParams.get("filterBy")?.toString(),
    limit: searchParams.get("limit")?.toString() ?? "all",
    sortBy: searchParams.get("sortBy")?.toString() ?? "date:desc",
  };
  // initialize the base query
  let query = supabase.from("shifts").select();
  // extract the params
  if (limit && (limit === "all" || !isNaN(parseInt(limit, 10)))) {
    query = query.limit(parseInt(limit, 10));
  }
  if (filterBy && filterBy !== "all") {
    const [column, value] = filterBy.split(":");
    query = query.eq(column as keyof ShiftData, value);
  }
  if (sortBy) {
    const [key, value] = sortBy.split(":");
    query = query.order(
      key as keyof ShiftData,
      { ascending: value === "asc" },
    );
  }

  const { data, error } = await query;

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, {
      status: 400,
    });
  }

  return NextResponse.json({ data, error }, { status: 200 });
}

export async function POST(
  req: NextRequest,
): Promise<ApiResponse<ShiftData | null>> {
  const supabase = await createServerClient<Database, "rms">("rms");
  // handle the request
  const body = await req.json();
  // Extract and validate required fields
  const { assignee, organization_id, date, tips_cash, tips_credit } = body;

  // Validate required fields
  if (!date || isNaN(Date.parse(date))) {
    logger.error("A valid date is required");
    return NextResponse.json(
      { data: null, error: "A valid date is required" },
      {
        status: 400,
      },
    );
  }
  if (!organization_id) {
    logger.warn("No `organization_id` provided");
  }

  // insert the data
  const { data, error } = await supabase.from("shifts").insert({
    assignee,
    organization_id,
    date,
    tips_cash,
    tips_credit,
  }).select().single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, {
      status: 500,
    });
  }

  return NextResponse.json({ data, error }, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
): Promise<ApiResponse<ShiftData | null>> {
  const supabase = await createServerClient<Database, "rms">("rms");
  // handle the request
  const { searchParams } = new URL(req.url);

  const searchId = searchParams.get("id")?.toString();
  // get the body of the request
  const body = await req.json();
  // destructure the body
  const {
    id = searchId,
    ...values
  } = body;
  // update the data
  const { data, error } = await supabase.from("shifts")
    .update({ id, ...values })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data: null, error: error.message }, {
      status: 500,
    });
  }

  return NextResponse.json({ data, error }, { status: 200 });
}
