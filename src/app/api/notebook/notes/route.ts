/**
 * Created At: 2025.08.11:20:03:36
 * @author - @FL03
 * @file - notes/route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export const GET = async (req: NextRequest) => {
  // initialize the supabase client
  const supabase = await createServerClient<Database, "notebook">();
  // deconstruct the url
  const { searchParams } = new URL(req.url);
  // extract the necessary params from the request query
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  // define the query
  let query = supabase.from("notes")
    .select();
  // handle the possible params
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
      "An error occurred when fetching the notes for the user",
    );
    return NextResponse.json(
      { data: [] },
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
    logger.error(
      error,
      "An error occurred deleting the note; please try again later.",
    );
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ data }, { status: 200 });
};
