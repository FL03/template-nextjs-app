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
// types
import type { MemberData } from "@/features/orgs";
import type { Database } from "@/types/database.types";
import type { ApiResponse } from "@/types";

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<MemberData[]>> {
  // initialize a supabase client
  const supabase = await createServerClient<Database, "orgs">("orgs");
  // deconstruct the parsed url
  const { searchParams } = new URL(req.url);
  // extract the necessary query params
  const filterBy = searchParams.get("filterBy")?.toString() ?? "all";
  const sortBy = searchParams.get("sortBy")?.toString();
  const limit = searchParams.get("limit")?.toString() ?? "all";
  // initialize the base query
  let query = supabase.from("members").select();

  if (filterBy && filterBy !== "all") {
    const [field, value] = filterBy.split(":");
    query = query.eq(field, value);
  }

  if (sortBy) {
    const [field, direction] = sortBy.split(":");
    query = query.order(field, { ascending: direction === "asc" });
  }

  if (limit && limit !== "all" && !isNaN(Number.parseInt(limit, 10))) {
    query = query.limit(Number.parseInt(limit, 10));
  }

  // execute the query
  const { data, error } = await query;

  if (error) {
    logger.error(error.message);
    return NextResponse.json(
      { error: error.message, data: null },
      { status: 500 },
    );
  }
  return NextResponse.json({ data: data ?? [], error }, { status: 200 });
}
