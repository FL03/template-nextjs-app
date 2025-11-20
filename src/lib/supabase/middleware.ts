/**
 * Created At: 2025-04-04:22:11:40
 * @author - @FL03
 * @file - middleware.ts
 */
"use server";
// imports
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
// feature-specific
import { supabaseCreds } from "./helpers";

const authenticationEndpoint = "/auth";
const pricingEndpoint = "/pricing";

/**
 * The middleware for integrate the application with supabase;
 * @param {NextRequest} request - the initial request object for the current request.
 * @returns {Promise<NextResponse>} - the response object for the current request.
 */
export const supabaseUserSessionProxy = async (
  request: NextRequest,
): Promise<NextResponse> => {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const { url, anonKey } = supabaseCreds();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith(authenticationEndpoint)) {
    const url = request.nextUrl.clone();
    url.pathname = authenticationEndpoint;
    return NextResponse.redirect(url);
  }

  // Subscription check for authenticated users
  if (
    user &&
    user.user_metadata?.subscription_status !== "active" &&
    !request.nextUrl.pathname.startsWith(pricingEndpoint)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pricingEndpoint;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};

export default supabaseUserSessionProxy;
