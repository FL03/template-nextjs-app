/**
 * Created At: 2025.09.28:09:50:46
 * @author - @FL03
 * @directory - src/app/auth
 * @file - route.ts
 */
"use server";
// imports
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// project
import { getDefaultSignInView, isRegistration } from "@/features/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  // get the cookies
  const cookieStore = await cookies();
  const preferredSignInView = cookieStore.get("preferredSignInView")?.value;
  const defaultView = getDefaultSignInView(preferredSignInView || null);

  const redirectTo = new URL(`/auth/${defaultView}`, url.origin);
  // redirect to the default view
  return NextResponse.redirect(redirectTo);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const origin = new URL(req.url);
  const view = origin.searchParams.get("view")?.toString().toLowerCase() ??
    "login";

  if (isRegistration(view)) {
    return NextResponse.redirect("/auth/register", 302);
  }
  return NextResponse.redirect(`/auth/${view}`, 302);
}
