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
  const { pathname, searchParams } = new URL(req.url);
  const endSegment = pathname.split("/").pop();
  const queryBy = searchParams.get("queryBy")?.toString() ?? "id";
  // if a username is provided, query by username
  if (!endSegment) {
    return NextResponse.json({
      data: null,
      error: "Unable to fetch data without a valid identifier",
    }, { status: 400 });
  }

  const { data, error } = await supabase.from("profiles").select().eq(
    queryBy,
    endSegment,
  ).single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}
/**
 * Delete a user profile using a unique identifier, namely an: email, username, or userId.
 */
export async function DELETE(
  req: NextRequest,
): Promise<ApiResponse<ProfileData | null>> {
  // initialize the server-side supabase client
  const supabase = await createServerClient<any, "public">();
  // handle the request
  const { pathname, searchParams } = new URL(req.url);
  const userId = pathname.split("/").pop();
  const queryBy = searchParams.get("queryBy")?.toString() ?? "id";
  // if no identifiers are provided, return an error
  if (!userId) {
    return NextResponse.json({
      data: null,
      error: "Unable to delete a profile without any valid identifiers.",
    }, {
      status: 400,
    });
  }
  // create & execute the query on the database
  const { data, error } = await supabase.from("profiles").delete({
    count: "exact",
  }).eq(queryBy, userId).select().single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function POST(
  req: NextRequest,
): Promise<ApiResponse<ProfileData | null>> {
  const supabase = await createServerClient();
  const { pathname, searchParams } = new URL(req.url);
  const id = pathname.split("/").pop();
  const queryBy = searchParams.get("queryBy")?.toString() ?? "id";
  if (!id) {
    return NextResponse.json({
      data: null,
      error: "Unable to upsert the user profile without a valid identifier",
    }, { status: 400 });
  }
  const keys = queryBy === "username" ? { username: id }:{ id };
  // get the form data from the request
  const payload = await req.json() as Partial<ProfileData>;
  // upsert the formData into the profiles table and return the entry
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        ...keys,
        ...payload,
      },
      { onConflict: "id" },
    )
    .eq(queryBy, id)
    .select()
    .single();
  // check for errors
  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, {
      status: 500,
    });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

/**  */
export async function PATCH(
  req: NextRequest,
): Promise<ApiResponse<ProfileData | null>> {
  const supabase = await createServerClient();
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({
      data: null,
      error: "Unable to fetch data without a valid identifier",
    }, { status: 400 });
  }
  // get the form data from the request
  const {
    username,
    avatar_url,
    bio,
    display_name,
    role,
    status,
  } = await req.json();
  // upsert the formData into the profiles table and return the entry
  const { data, error } = await supabase
    .from("profiles")
    .update(
      {
        username,
        avatar_url,
        bio,
        display_name,
        role,
        status,
      },
    )
    .eq("id", id)
    .select()
    .single();
  // check for errors
  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, {
      status: 500,
    });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}
