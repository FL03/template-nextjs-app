/**
 * Created At: 2025.07.16:07:24:28
 * @author - @FL03
 * @file - utils/helpers.ts
 */

import { RealtimeChannel } from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
import {
  createBrowserClient,
  handleRealtimeSubscription,
  RealtimeSupabaseHandler,
} from "@/lib/supabase";
// local
import { ProfileData } from "../types";
import { CACHE_KEY_USERNAME } from "@/lib/constants";

type OnProfileChangeOptions = {
  userId?: string;
  username?: string;
  supabaseClient?: ReturnType<typeof createBrowserClient>;
  onChange?: (data?: Partial<ProfileData> | null) => void;
  onSubscribe?: RealtimeSupabaseHandler;
};

type OnProfileChangeT = (opts?: OnProfileChangeOptions) => RealtimeChannel;

/**
 * This method initializes a realtime channel for listening to changes to a particular entry, or profile, that has the given username or userId.
 */
export const createProfileChannel: OnProfileChangeT = (
  {
    userId,
    username,
    supabaseClient,
    onChange,
    onSubscribe = handleRealtimeSubscription,
  } = {},
) => {
  if (!username && !userId) {
    logger.error(
      "To create a realtime channel, either the `userId` or `username` must be provided.",
    );
    throw new Error("Channel Error: No `username` or `userId` provided");
  }
  let _filter;
  if (username) {
    _filter = `username=eq.${username}`;
  } else if (userId) {
    _filter = `id=eq.${userId}`;
  } else {
  }
  // use the given supabase client if provided, otherwise create a new one
  const supabase = supabaseClient ?? createBrowserClient();
  // define the subscription
  return supabase
    .channel(`profiles:${username}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
        filter: _filter,
      },
      (payload) => {
        if (payload.new) onChange?.(payload.new);
      },
    )
    .subscribe(onSubscribe);
};

export const subscribeToProfileChanges = (
  opts: OnProfileChangeOptions,
): RealtimeChannel => {
  // create the channel
  const channel = createProfileChannel(opts);
  // return the channel
  return channel;
};

/** Cache the given username */
export const cacheUsername = (
  username?: string | null,
  options?: { clearCache?: boolean },
): void => {
  // destructure the options and set defaults
  const { clearCache = false } = options || {};
  // ensure the window is defined (i.e., this is running in the browser)
  if (typeof window === "undefined") return;
  if (username) {
    // cache the username in the local storage
    logger.trace("Caching the username...");
    try {
      window.localStorage.setItem(CACHE_KEY_USERNAME, username);
      logger.info("Username cached successfully");
    } catch (e) {
      logger.error(e, "Failed to cache username");
    } finally {
      return;
    }
  } else {
    logger.warn("No username provided; clearing the previous cache...");
    // clear the cache if toggled
    if (clearCache) clearCachedUsername();
  
    return;
  }
};

/** A simple helper function to clear the cached username */
export const clearCachedUsername = () => {
  // ensure the window is defined
  if (typeof window === "undefined") return;
  // clear the cached username
  try {
    window.localStorage.removeItem(CACHE_KEY_USERNAME);
    logger.info("successfully cleared the cached username");
  } catch (e) {
    logger.error(e, "Failed to clear cached username");
  }
};
