/**
 * Created At: 2025.08.05:17:59:52
 * @author - @FL03
 * @file - cache.ts
 */
"use client";
// project
import { CACHE_KEY_USER_ID, CACHE_KEY_USERNAME } from "@/lib/constants";
import { logger } from "@/lib/logger";

const removeCached = (key: string) => {
  // ensure the window object is available
  if (typeof window === "undefined") return;
  // handle the clearing of the cached item
  try {
    window.localStorage.removeItem(key);
    logger.info(`Successfully cleared the cached item: ${key}`);
  } catch (error) {
    logger.error(error, `Failed to clear cached item: ${key}`);
  }
};

/**
 * The `cacheUserId` function is a callback for caching the user ID of a user in the local storage, automatically handling the case where no window object is available by returning early and
 * clearing the cache when no user ID is provided.
 * @returns
 */
export const cacheUserId = (
  userId?: string | null,
  options?: { clear?: boolean },
) => {
  // deconstruct the options
  const { clear } = options || {};
  // ensure the window object is available
  if (typeof window === "undefined") return;
  // handle the case where no user was provided or the clear option is set to true
  if (clear || !userId) {
    // clear the cache
    removeCached(CACHE_KEY_USER_ID);
    // finish
    return;
  }
  // cache the userId
  try {
    window.localStorage.setItem(CACHE_KEY_USER_ID, userId);
  } catch (e) {
    // log the error
    logger.error(e, "Failed to cache userId");
  }
};

/**
 * A simple callback for handling the cached username; if a window object is available and no username is passed, the cached value will be automatically cleared,
 * however, when one is provided the method tries to cache it in the local storage.
 */
export const cacheUsername = (
  username?: string | null,
  options?: { clear?: boolean },
) => {
  // deconstruct the options
  const { clear } = options || {};
  // ensure the window object is available
  if (typeof window === "undefined") return;
  // handle the case where no username was provided
  if (clear || !username) {
    // clear the cache
    removeCached(CACHE_KEY_USERNAME);
    // finish
    return;
  }
  // cache the username
  try {
    window.localStorage.setItem(CACHE_KEY_USERNAME, username);
  } catch (e) {
    // log the error
    logger.error(e, "Failed to cache username");
  }
  return username;
};
