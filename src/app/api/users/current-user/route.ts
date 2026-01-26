/**
 * Created At: 2025-04-09:19:07:06
 * @author - @FL03
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";
// types
import type { ApiResponse } from "@/types";

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<User>> {
  const supabase = await createServerClient();
  // get the current user
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data: data.user, error: error.message }, {
      status: 500,
    });
  }
  return NextResponse.json({
    data: data.user,
    error,
  }, { status: 200 });
}
