/**
 * Created At: 2025.08.11:20:01:21
 * @author - @FL03
 * @file - notebook/route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export const GET = async (req: NextRequest) => {
  // deconstruct the url
  const { searchParams } = new URL(req.url);
  // extract the necessary parameters from the request query
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  // initialize the supabase client
  const supabase = await createServerClient<Database, "notebook">();
  // define the query
  let query = supabase.from("books")
    .select();
  // handle the possible identifiers
  if (id) {
    query = query.eq("id", id);
  }
  if (userId) {
    query = query.eq("user_id", userId);
  }
  // execute the query to fetch the data for the user
  const { data, error } = await (id ? query.single() : query);
  // handle any errors, otherwise return the data
  if (error) {
    logger.error(
      error,
      "An error occurred fetching the notebooks for the user",
    );
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 500 },
    );
  } else return NextResponse.json({ data }, { status: 200 });
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
    return NextResponse.error();
  }
  // initialize the supabase client
  const supabase = await createServerClient<Database, "notebook">();
  // delete notifications for the user
  const { data, error } = await supabase
    .from("books")
    .delete()
    .eq("id", id);

  if (error) {
    logger.error(error, "An error occurred deleting the notification");
    return NextResponse.json(
      { error: error.message },
      { status: error.code === "23503" ? 404 : 500 },
    );
  } else return NextResponse.json({ data }, { status: 200 });
};
