/**
 * Created At: 2025-04-03:18:53:23
 * @author - @FL03
 * @endpoint - /api/organizations/[id]
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";
import { ApiResponse } from "@/types";
import { OrganizationData } from "@/features/orgs";
import { Database } from "@/types/database.types";

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<OrganizationData | null>> {
  const supabase = await createServerClient<Database, "orgs">("orgs");
  // parse the request url
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split("/").pop();
  // ensure an id is provided
  if (!id) {
    // return an empty array if no identifier is provided
    return NextResponse.json(
      {
        error:
          "Unable to fetch an organizations without its unique identifier.",
        data: null,
      },
      { status: 400 },
    );
  }
  // execute the query
  const { data, error } = await supabase.from("organizations").select().eq(
    "id",
    id,
  ).single();
  // handle any errors
  if (error) {
    logger.error(
      error,
      "An unexpected error occurred when fetching the notification from the database: " +
        error.message,
    );
    return NextResponse.json(
      { error: error.message, data },
      { status: 500 },
    );
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
): Promise<ApiResponse<OrganizationData | null>> {
  const supabase = await createServerClient<Database, "orgs">("orgs");
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split("/").pop();
  // handle the case where the username is present
  if (!id) {
    // log the error
    logger.error("No id passed to the api");
    // return a 400 error response
    return NextResponse.json(
      { error: "no id passed to the api", data: null },
      { status: 400 },
    );
  }
  // delete organizations for the user
  const { data, error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error(error, "An error occurred deleting the notification");
    throw new Error(error.message);
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function POST(
  req: NextRequest,
): Promise<ApiResponse<OrganizationData | null>> {
  const supabase = await createServerClient<Database, "orgs">("orgs");
  // handle the request url
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      {
        error: "Unable to update an organization without its id",
        data: null,
      },
      { status: 400 },
    );
  }
  // handle the request
  const { name, description, homepage, logo } = await req.json();
  // query the database
  const { data, error } = await supabase.from("organizations").upsert(
    {
      id,
      name,
      description,
      homepage,
      logo,
    },
  ).eq("id", id).select().single();
  // handle any errors
  if (error) {
    logger.error(error, error.message);
    return NextResponse.json(
      { error: error.message, data },
      { status: 400 },
    );
  }
  // return the response
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
): Promise<ApiResponse<OrganizationData | null>> {
  const supabase = await createServerClient<Database, "orgs">("orgs");
  // handle the request url
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      {
        error: "Unable to update an organization without its id",
        data: null,
      },
      { status: 400 },
    );
  }
  // handle the request
  const { name, description, homepage, logo } = await req.json();
  // query the database
  const { data, error } = await supabase.from("organizations").update(
    {
      name,
      description,
      homepage,
      logo,
    },
  ).eq("id", id).select().single();
  // handle any errors
  if (error) {
    logger.error(error, error.message);
    return NextResponse.json(
      { error: error.message, data },
      { status: 400 },
    );
  }
  // return the response
  return NextResponse.json({ data, error }, { status: 200 });
}
