/**
 * Created At: 2025.10.31:10:51:01
 * @author - @FL03
 * @directory - src/types
 * @file - routes.ts
 */
import type { Nullish } from "@/types";
import type { UrlObject, URLSearchParams } from "url";

/** A type able to be passed to the `href` property on the `Link` component provided by nextjs. */
export type Href = string | UrlObject;
/** The type of query parameters that are allowed */
export type QueryParams =
  | Record<string, string>
  | URLSearchParams
  | string[][];

export type NavItem = { label: string; href: Href; icon?: React.ReactNode };

type DynamicPathSegmentValue = string | number | boolean;

export type RouteBuilderOptions<
  TParams extends Record<string, Nullish<DynamicPathSegmentValue>> = {},
  TSearch extends QueryParams = URLSearchParams,
> = {
  path?: string | string[];
  params: TParams;
  searchParams?: TSearch;
};

type RouteParams = Record<string, string> | { [key: string]: string };

export type PropsWithRoute<
  T = {},
  TParams extends RouteParams = {},
  TQuery extends QueryParams = {},
> = T & {
  params: Promise<TParams>;
  searchParams: Promise<TQuery>;
};
