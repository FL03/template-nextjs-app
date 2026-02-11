/**
 * Created At: 2025.10.31:10:51:01
 * @author - @FL03
 * @directory - src/types
 * @file - routes.ts
 */
import { ReactNode } from 'react';
import type { UrlObject, URLSearchParams } from 'url';

/** A type able to be passed to the `href` property on the `Link` component provided by nextjs. */
export type Href = string | UrlObject;
/** The type of query parameters that are allowed */
export type QueryParams = Record<string, string> | URLSearchParams | string[][];

export type NavItemData<T = {}> = T & {
  label: string;
  href: Href;
  icon?: ReactNode;
};
