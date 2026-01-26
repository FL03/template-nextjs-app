/**
 * Created At: 2025.10.31:10:46:04
 * @author - @FL03
 * @directory - src/lib/utils
 * @file - endpoint.ts
 */

type QueryParams =
  | Record<string, string>
  | URLSearchParams
  | string[][];

/**
 * Automatically resolve the _**origin**_ of the caller; this is a useful workaround for NextJS applications as it accounts
 * for both server-side and client-side environments.
 */
export function resolveOrigin(
  { key = "NEXT_PUBLIC_SITE_URL", defaultValue = "http://localhost:3000" } = {},
): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env[key] ?? defaultValue;
}

/** filter out nullish parameters from some object */
export function parseSearchParams<TSearch = QueryParams>(
  values?: TSearch | null,
): URLSearchParams {
  const params = new URLSearchParams();
  // handle the case where params is undefined or null
  if (!values) return params;
  // otherwise, filter out nullish values
  Object.entries(values).forEach(([key, value]) => {
    if (!value || value == null) return;
    if (Array.isArray(value)) {
      value.forEach((value) => params.append(key, String(value)));
    } else {
      params.append(key, String(value));
    }
  });
  return params;
}

/**
 * A simple method for extending the given path with some `searchParams` and creating a compatible `URL` object configured with the resolved origin.
 * @param {string} [endpoint] - the path to extend
 * @param {Object} [options] - optional settings
 * @returns {URL} a new URL object with the provided path and search parameters.
 */
export const createUrl = (
  endpoint: string,
  { searchParams }: { searchParams?: QueryParams } = {},
): URL => {
  // initialize a new URL with the provided path and the resolved origin
  const url = new URL(endpoint, resolveOrigin());
  if (searchParams) {
    url.search = parseSearchParams(searchParams).toString();
  }
  return url;
};
