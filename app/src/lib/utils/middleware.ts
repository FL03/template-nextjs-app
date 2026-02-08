/**
 * Created At: 2025.10.25:14:33:42
 * @author - @FL03
 * @directory - src/lib/utils
 * @file - middleware.ts
 */

type IgnorePathsOptions = {
  matches?: string | RegExp;
  ignore?: string[];
  skipHome?: boolean;
};

export const getProxyRegex = (): RegExp => (
  new RegExp(
    /^(about|api|auth|pricing|privacy|terms|help|_next\/static|_next\/image|.*\.(svg|png|jpg|jpeg|gif|webp|ico)$)/,
  )
);

/** A utilitarian function used to determine if a given pathname should be ignored based on the given criteria.
 * @param {string} [pathname] - The pathname to check.
 * @param {string | RegExp} [options.matches] - A string or regular expression to match against the pathname.
 * @param {string[]} [options.ignore] - An array of path segments to ignore.
 * @param {boolean} [options.skipHome] - Whether to skip the home path ("/").
 * @returns {boolean} Returns true if the pathname should be ignored; i.e., matches the ignore criteria.
 */
export function ignorePaths(
  pathname: string,
  { matches, ignore, skipHome = true }: IgnorePathsOptions = {},
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
}
