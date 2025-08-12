/**
 * Created At: 2025.07.16:08:11:40
 * @author - @FL03
 * @file - constants/cache.ts
 */

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
