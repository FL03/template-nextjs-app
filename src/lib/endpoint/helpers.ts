/**
 * Created At: 2025-04-08:08:35:33
 * @author - @FL03
 * @description - description
 * @file - urls.ts
 */
// project
import { QueryParams } from "./types";

export const createEndpointUrl = (endpoint: string, path?: string) => {
  if (!path) return new URL(endpoint, resolveOrigin());
  return new URL([endpoint, path.trim()].join("/"), resolveOrigin());
};

export const buildEndpoint = (base: string, ...path: string[]) => {
  return `${base}${path.length ? `/${path.join("/")}` : ""}`;
};
/**
 * Automatically resolve the _**origin**_ of the caller; this is a useful workaround for NextJS applications as it accounts
 * for both server-side and client-side environments.
 */
export const resolveOrigin = () => {
  // declare a variable to hold the origin
  let origin: string = "http://localhost:3000";
  // handle the case where the code is running in a server-side environment
  if (typeof window === "undefined") {
    const tmp = process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL;
    if (tmp && tmp.trim() !== "") {
      origin = tmp;
    }
  } else {
    origin = window.location.origin;
  }
  return origin;
};

/**
 * A simple method for extending the given path with some `searchParams` and creating a compatible `URL` object configured with the resolved origin.
 * @param {string} path - the path to extend
 * @param {QueryParams | undefined} searchParams - the search parameters to include in the URL.
 * @returns {URL} a new URL object with the provided path and search parameters.
 */
export const createUrl = (
  path: string,
  searchParams?: QueryParams,
): URL => {
  // resolve the origin for the caller
  const origin = resolveOrigin();
  // parse the search parameters into a URLSearchParams object
  const params = new URLSearchParams(searchParams);
  // initialize a new URL with the provided path and the resolved origin
  const url = new URL(path, origin);
  // set the search parameters on the URL
  url.search = params.toString();
  // return the constructed URL
  return url;
};

/** filter out nullish parameters from some object */
export function filterSearchParamsObject<TSearch = QueryParams>(
  params?: TSearch,
): URLSearchParams {
  // handle the case where params is undefined or null
  if (!params) return new URLSearchParams();
  // otherwise, filter out nullish values
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null,
    ),
  );
  // parse the object as a record
  const parsedData = filtered as Record<string, string>;
  // use the parsed data to create a URLSearchParams object
  return new URLSearchParams(parsedData);
}
