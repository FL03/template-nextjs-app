/**
 * Created At: 2025.07.19:08:07:30
 * @author - @FL03
 * @file - builder.ts
 */

type MergePathT = (base: string, path?: string | string[], options?: { delimiter?: string }) => string;
/** Merge an endpoint prefix with the provided path(s) and using the given delimiter. */
export const mergePath: MergePathT = (
    base: string,
    path?: string | string[],
    { delimiter } = { delimiter: '/' },
) => {
  // handle the case where no path is provided
  if (!path) {
    // if no path is provided, return the base path
    return base;
  }
  // if a path is provided, return the base path with the path appended
  if (Array.isArray(path)) {
    return [base, ...path].join(delimiter);
  } else {
    return [base, path].join(delimiter);
  }
};

type SearchParams = string[][] | Record<string, string> | URLSearchParams;

type EndpointBuilderOptsT<TParam, TSearch = SearchParams> = {
  path?: string | string[];
  params: TParam;
  searchParams?: TSearch;
};

export function endpointBuilder<TParam, TSearch = SearchParams>(
  { path, searchParams }: EndpointBuilderOptsT<TParam, TSearch>,
): string {
  // construct the base path
  const basePath = "/";
  if (!searchParams) {
    // if no path is provided, return the base path
    if (!path) {
      return basePath;
    }
    // if a path is provided, return the base path with the path appended
    return mergePath(basePath, path);
  }
  // construct the query parameters
  const queryParams = new URLSearchParams(searchParams).toString();
  // if no path is provided, return the base path
  if (!path) {
    // con
    return basePath + `?${queryParams}`;
  }
  // add the path before the query parameters
  return mergePath(basePath, path)+ `?${queryParams}`;
}