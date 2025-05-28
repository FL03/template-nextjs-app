// links.ts
import { UrlObject } from 'url';

/** A type able to be passed to the `href` property on the `Link` component provided by nextjs. */
export type Url = string | UrlObject;


export type BaseLinkProps = {
  href: Url;
  icon?: React.ReactNode;
  label?: React.ReactNode;
}
/** This type defines the basic properties of any navigation link used throughout the project. */
export type LinkProps = BaseLinkProps & {
  disabled?: boolean;
  name?: string;
  description?: string;
};

export type LinkSearchParams = string[][] | { [key: string]: string | string[] | undefined } | URLSearchParams;