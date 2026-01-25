/**
 * Created At: 2025.10.25:13:23:35
 * @author - @FL03
 * @directory - packages/endpoint/src
 * @file - types.ts
 */
// imports
import type { UrlObject } from "url";

/** A type able to be passed to the `href` property on the `Link` component provided by nextjs. */
export type Href = string | UrlObject;
/** The type of query parameters that are allowed */
export type QueryParams =
  | Record<string, string>
  | URLSearchParams
  | string[][];

export type EndpointConfig = {
  name: string;
  param?: string;
  slug?: string;
};

export type WithEndpointConfig<T, Config extends EndpointConfig> = T & Config;

export type PathParam<Path extends string> = `:${Path}`;

export type Segment<Path extends string> = Path extends `${infer _Start}/${infer Rest}`
  ? Segment<`/${Rest}`>
  : Path extends PathParam<infer Param> ? Param
  : never;

export type DynamicEndpoint<Path extends string> = {
  [K in Path]: Segment<K> extends infer Param
  ? Param extends `${infer _Start}/${infer Rest}`
  ? { param: Param & string; } & DynamicEndpoint<`/${Rest}`>
  : {}
  : never;
};
