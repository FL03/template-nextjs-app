/**
 * Created At: 2025.07.17:10:30:28
 * @author - @FL03
 * @file - middleware.ts
 */
"use server";
// imports
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
// project
import { supabaseUserSessionProxy } from "@/lib/supabase";
import { ignorePaths } from "@/lib/utils";

/**
 * The middleware for the application; currently integrates each request with supabase related metadata and cookies.
 *
 * @param {NextRequest} request - The request object for the current request.
 * @returns {Promise<NextResponse>} The response object for the current request.
 * @see https://nextjs.org/docs/app/getting-started/proxy for more information on middleware.
 */
export async function proxy(
  request: NextRequest,
): Promise<NextResponse> {
  const { pathname: nextPath } = request.nextUrl;

  let skip: boolean = false;
  if (nextPath === "/") skip = true;
  skip ||= ignorePaths(nextPath);
  // if the pathname is ignored, return the response
  if (skip) {
    return NextResponse.next();
  }
  // modify and return the response to integrate with Supabase
  return await supabaseUserSessionProxy(request);
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!about|api|auth|docs|pricing|privacy|terms|help|_next/static|_next/image|.*\\.svg|png|jpg|jpeg|gif|webp|ico$).*)",
  ],
};
