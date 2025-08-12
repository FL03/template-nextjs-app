/**
 * Created At: 2025-04-03:18:53:23
 * @author - @FL03
 * @description - an api route for notifications
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";

export const GET = async (req: NextRequest) => {
  // deconstruct the url
  const { searchParams } = new URL(req.url);
  // extract the user identifier from the request quer
  const username = searchParams.get("username");
  const userId = searchParams.get("userId");
  // initialize the supabase client
  const supabase = await createServerClient();
  // define the query
  let query = supabase.from("notifications")
    .select();
  // handle the possible identifiers
  if (userId) {
    query = query.eq("user_id", userId);
  } else if (username) {
    query = query.eq("username", username);
  } else {
    // return an empty array if no identifier is provided
    return NextResponse.json(
      [],
      { status: 400 },
    );
  }
  // fetch notifications for the user
  const { data, error } = await query;
  // handle any errors
  if (error) {
    logger.error(
      error,
      "An error occurred fetching notifications for the user",
    );
    return NextResponse.json(
      [],
      { status: 500 },
    );
  }
  return NextResponse.json(data, { status: 200 });
};

export const DELETE = async (req: NextRequest) => {
  // deconstruct the url
  const { searchParams } = new URL(req.url);
  // extract the user identifier from the request query
  const id = searchParams.get("id");
  // handle the case where the username is present
  if (!id) {
    // log the error
    logger.error("No id passed to the api");
    // return a 400 error response
    return NextResponse.json(
      { error: "no id passed to the api" },
      { status: 400 },
    );
  }
  // initialize the supabase client
  const supabase = await createServerClient();
  // delete notifications for the user
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error(error, "An error occurred deleting the notification");
    throw new Error(error.message);
  }
  return NextResponse.json(data, { status: 200 });
};
