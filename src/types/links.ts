// links.ts
import { ReactNode } from 'react';
import { UrlObject } from 'url';

/** A type able to be passed to the `href` property on the `Link` component provided by nextjs. */
export type Url = string | UrlObject;


export type BaseLinkProps = {
  href: Url;
  icon?: ReactNode;
  label?: ReactNode;
}
/** This type defines the basic properties of any navigation link used throughout the project. */
export type LinkProps = BaseLinkProps & {
  disabled?: boolean;
  name?: string;
  description?: string;
};

export type DynamicSearchParams = string[][] | { [key: string]: string | string[] | undefined } | URLSearchParams;

export type SearchParamsType = string[][] | { [key: string]: string | string[] | undefined } | URLSearchParams;

export type DynamicRouteSearchParams = {
  [key: string]: SearchParamsType;
}

export type DynamicPageRouteProps<TParams extends string = string, TSearchParams extends DynamicRouteSearchParams = {}> = {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}