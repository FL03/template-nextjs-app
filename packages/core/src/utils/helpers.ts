/**
 * Created At: 2025.09.27:14:46:04
 * @author - @FL03
 * @directory - src/lib/utils
 * @file - helpers.ts
 */


/**
 * A utilitarian function to check if a pathname is ignored and/or matches a provided regex.
 * /^\/(?:(?!api|about|auth|not-found|terms|privacy)[^\/])/
 * @param {string | RegExp} matches - A string or regular expression to match against the pathname.
 * @returns {boolean} returns true if the pathname is ignored or matches the provided regex.
 */
export function ignorePaths(
  pathname: string,
  { matches, ignore, skipHome = true }: {
    matches?: string | RegExp;
    ignore?: string[];
    skipHome?: boolean;
  } = {},
): boolean {
  // split the pathname to get the first segment
  const firstSegment = pathname.split("/").pop();
  // check if the pathname is empty or matches the ignored paths
  let isIgnored = false;
  if (skipHome) {
    isIgnored ||= pathname === "/" || firstSegment === "";
  }
  if (firstSegment && ignore && Array.isArray(ignore)) {
    isIgnored ||= ignore.includes(firstSegment);
  }
  if (firstSegment && matches) {
    isIgnored ||= new RegExp(matches).test(firstSegment);
  }
  // return true if the pathname is ignored
  return isIgnored;
};
