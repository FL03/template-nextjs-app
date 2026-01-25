/**
 * Created At: 2025.09.27:15:19:34
 * @author - @FL03
 * @endpoint - /api/profiles/user
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";
// types
import type { ProfileData } from "@/features/profiles";
import type { ApiResponse } from "@/types";

export async function GET(req: NextRequest): Promise<ApiResponse<ProfileData>> {
  // initialize the server-side supabase client
  const supabase = await createServerClient();
  // create a new URL object from the request URL
  const { searchParams } = new URL(req.url);
  // destructure the search parameters to get the email, username, and userId
  const { username, userId } = {
    username: searchParams.get("username")?.toString(),
    userId: searchParams.get("userId")?.toString(),
  };
  // if a username is provided, query by username
  if (!username && !userId) {
    logger.error({ username, userId }, "No username or userId provided...");
    return NextResponse.json({
      data: null,
      error: "Unable to fetch data without a valid identifier",
    }, { status: 400 });
  }
  // initialize the query to select a profile
  let query = supabase.from("profiles").select("*", { count: "exact" });
  // handle the different cases for querying a profile
  if (username) {
    query = query.eq("username", username);
  }
  if (userId) {
    query = query.eq("id", userId);
  }

  const { data, error } = await query.single();

  if (error) {
    logger.error(error, "Error querying the database...");
    return NextResponse.json({ data: null, error }, { status: 500 });
  }
  return NextResponse.json({ data, error: null }, { status: 200 });
}
