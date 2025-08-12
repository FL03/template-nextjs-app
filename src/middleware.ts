/**
 * Created At: 2025.07.17:10:30:28
 * @author - @FL03
 * @file - middleware.ts
 */
"use server";
// imports
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
// project
import { handleUserSession } from "@/lib/supabase/middleware";

const IGNORED_PATHS = new Set([
  "about",
  "api",
  "auth",
  "error",
  "not-found",
  "privacy",
  "terms",
]);

/**
 * A utilitarian function to check if a pathname is ignored and/or matches a provided regex.
 * /^\/(?:(?!api|about|auth|not-found|terms|privacy)[^\/])/
 * @param {string | RegExp} matches - A string or regular expression to match against the pathname.
 * @returns {boolean} returns true if the pathname is ignored or matches the provided regex.
 */
const ignorePaths = (pathname: string, matches?: string | RegExp): boolean => {
  // split the pathname to get the first segment
  const [_, firstSegment] = pathname.split("/");
  // check if the pathname is empty or matches the ignored paths
  const isIgnored = pathname === "/" || IGNORED_PATHS.has(firstSegment);
  // if matches is provided, check if the pathname matches the regex
  if (matches) {
    return isIgnored || new RegExp(matches).test(pathname);
  }
  // return true if the pathname is ignored
  return isIgnored;
};

/**
 * The middleware for the application; currently integrates each request with supabase related metadata and cookies.
 *
 * @param {NextRequest} request - The request object for the current request.
 * @returns {Promise<NextResponse>} The response object for the current request.
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware for more information on middleware.
 */
export async function middleware(
  request: NextRequest,
): Promise<NextResponse> {
  // get the pathname from the request
  const pathname = request.nextUrl.pathname;
  // if the pathname is ignored, return the response
  if (
    ignorePaths(
      pathname,
      /^\/(?:(?!api|about|auth|error|not-found|terms|privacy)[^\/])/,
    )
  ) {
    return NextResponse.next();
  }
  // modify and return the response to integrate with Supabase
  return await handleUserSession(request);
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
    // "/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/:path/portfolio",
    "/editor/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/users/:path*",
    {
      source: "/:path/portfolio",
      has: [
        {
          type: "query",
          key: "userId",
        },
      ],
      missing: [{ type: "cookie", key: "session", value: "active" }],
    },
  ],
};
