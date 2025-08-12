/**
 * Created At: 2025-04-09:19:07:06
 * @author - @FL03
 * @file - portfolio/route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";
// project
import { logger } from "@/lib/logger";
import { createServerClient, getCurrentUser } from "@/lib/supabase";
import { Database } from "@/types/database.types";
// features
import { ProfileIdentifiers } from "@/features/profiles";

export const GET = async (req: NextRequest) => {
  // initialize the server-side supabase client
  const supabase = await createServerClient<Database, "account">();
  // create a new URL object from the request URL
  const { searchParams } = new URL(req.url);
  // destructure the search parameters to get the email, username, and userId
  const { username }: ProfileIdentifiers = {
    email: searchParams.get("email") as string | null,
    username: searchParams.get("username"),
    userId: searchParams.get("userId") ?? searchParams.get("user_id") ??
      searchParams.get("uid"),
  };
  // ensure that at least one identifier is provided
  if (!username) {
    logger.error(
      { username },
      "Unable to fetch the portfolio without a valid identifier.",
    );
    return NextResponse.json(null, { status: 400 });
  }
  // initialize the query to select a profile
  let query = supabase.from("portfolio").select("*", { count: "exact" });

  if (username) {
    query = query.eq("username", username);
  }
  // execute the query and destructure the response
  const { data, error } = await query.single();
  // handle any errors
  if (error) {
    logger.error(error, "Error querying the database...");
    return NextResponse.error();
  }
  // return the data as a JSON response
  return NextResponse.json(data, { status: 200 });
};
/**
 * Delete a user profile using a unique identifier, namely an: email, username, or userId.
 */
export const DELETE = async (req: NextRequest) => {
  // initialize the server-side supabase client
  const supabase = await createServerClient<Database, "account">();
  // create a new URL object from the request URL
  const { searchParams } = new URL(req.url);

  const { email, username, userId }: ProfileIdentifiers = {
    email: searchParams.get("email"),
    username: searchParams.get("username"),
    userId: searchParams.get("userId") ?? searchParams.get("user_id") ??
      searchParams.get("uid"),
  };

  if (!email && !username && !userId) {
    logger.error(
      { email, username, userId },
      "No username or userId provided...",
    );
    return NextResponse.error();
  }
  // initialize the query to delete a profile
  let query = supabase.from("portfolio").delete({ count: "exact" });
  // handle the different cases for deleting a profile

  if (username) {
    query = query.eq("username", username);
  }

  const { data, error } = await query.single();

  if (error) {
    logger.error({ error }, "Error deleting the portfolio...");
    return NextResponse.error();
  }
  return NextResponse.json(data, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const { formData } = req;

  const supabase = await createServerClient<Database, "account">();
  // get the current user
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    logger.error("[POST] User not authenticated...");
    return NextResponse.error();
  }
  // destructure the user object to get the user id
  const { id: userId } = currentUser;
  // get the form data from the request
  const form = await formData();
  // upsert the formData into the profiles table and return the entry
  const { data, error } = await supabase
    .from("portfolio")
    .upsert(
      {
        id: v4(),
        user_id: userId,
        username: form.get("username") as string,
      },
      { onConflict: "id" },
    )
    .eq("user_id", userId)
    .select()
    .single();
  // check for errors
  if (error) {
    logger.error(error, "[POST] Error upserting the profile...");
    return NextResponse.error();
  }
  // log the success message
  logger.info({ data }, "Success: upserted the profile with the given data...");
  return NextResponse.json(data ?? {}, { status: 201 });
};
