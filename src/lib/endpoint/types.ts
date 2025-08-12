// links.ts
import { ReactNode } from "react";
import type { UrlObject } from "url";

/** A type able to be passed to the `href` property on the `Link` component provided by nextjs. */
export type Href = string | UrlObject;
/** The type of query parameters that are allowed */
export type QueryParams =
  | Record<string, string>
  | URLSearchParams
  | string[][];
/** The `LinkBuilder` defines the type for dynamic endpoint(s) in a manner similar to the next.js server-side page / route handling. */
export type LinkBuilder<
  TParams extends Record<string, string> = {},
  TSearch extends QueryParams = {},
> = (
  endpoint: string,
  params?: TParams,
  searchParams?: TSearch,
) => string;

/** This type defines the basic properties of any navigation link used throughout the project. */
export type LinkProps = {
  href: Href;
  icon?: ReactNode;
  label?: ReactNode;
  disabled?: boolean;
  description?: string;
};

export type RouteBuilderOptions<TParams, TSearch = QueryParams> = {
  path?: string | string[];
  params: TParams;
  searchParams?: TSearch;
};
