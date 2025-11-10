/**
 * Created At: 2025.09.14:20:49:41
 * @author - @FL03
 * @directory - src/lib/config
 * @file - consts.ts
 */

export const APP_AUTHOR: string = "FL03 <joe@pzzld.org> (https://pzzld.org)";

export const publicSiteUrl: URL = new URL("https://tips.pzzld.org");

export const getSiteUrl = (
  { key = "NEXT_PUBLIC_SITE_URL" }: { key?: string },
) => {
  const endpoint = process.env[key] ??
    "http://localhost:3000";
  return new URL(endpoint);
};

/** The prefix used to denote object stored within the local storage / cache. */
export const CACHE_PREFIX = "pzzld_org";

const cacheKey = (
  key: string,
  options?: { prefix?: string; delimiter?: string },
) => {
  // deconstruct the options
  const { delimiter = "_", prefix = CACHE_PREFIX } = options || {};
  // capitalize the prefix and the key before joining them with the specified delimiter
  return [prefix, key].map((value) => value.toLowerCase()).join(delimiter);
};

/** A constant value defining the key used throughout the platform to cache the username of the current user. */
export const CACHE_KEY_USERNAME = cacheKey("username");
/** A constant value defining the key used throughout the platform to cache the userId of the current user. */
export const CACHE_KEY_USER_ID = cacheKey("user_id");
