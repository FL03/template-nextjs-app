/**
 * Created At: 2025-04-08:12:14:28
 * @author - @FL03
 * @description - Hooks for working with authenticated users and their profiles
 * @file - use-profile.tsx
 */
"use client";
// imports
import * as React from "react";
import { Subscription } from "@supabase/supabase-js";
// project
import { CACHE_KEY_USERNAME } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase";

type HookOptionsT = {
  client?: ReturnType<typeof createBrowserClient<any, "public">>;
  onDataChange?: (data: string) => void;
  onError?: (error?: string) => void;
};

type UserStatus = "authenticated" | "unauthenticated";

type HookStateT = {
  isLoading: boolean;
  isRefreshing: boolean;
};

type HookReturnT = {
  status: UserStatus;
  state: HookStateT;
  username?: string;
  refresh: () => void;
};

/**
 * The `useUsername` hook is a custom React hook for managing the current user's username; the hook primarily relies upon the database function `public.username` to fetch the username,
 * invoking it with a browser-side supabase client. However, it also manages the cache for the username in the browser's local storage, allowing for quick access to the username without
 * needing to fetch it from the database every time. Moreover, the hook subscribes to authentication state changes, allowing it to update the username, and the hook state,
 * whenever the current user signs in or out.
 *
 * @returns {HookReturnT} A memoized object containg the current user's username alongisde additional information for managing the username state.
 */
export const useUsername = ({
  client,
  onError,
}: HookOptionsT = {}): HookReturnT => {
  // initialize the supabase client
  const supabase = client ?? createBrowserClient();
  // initialize stateful variables
  const [_value, _setValue] = React.useState<string | null>(null);
  const [_error, _setError] = React.useState<string | null>(null);
  // create a ref to store the auth subscription
  const authSubRef = React.useRef<Subscription | null>(null);
  // define the various signals of the hook
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  // ensure that the status is current with the data
  const _status: UserStatus = React.useMemo(() => {
    // if a username is found, return 'authenticated'
    if (_value) return "authenticated";
    // otherwise return 'unauthenticated'
    return "unauthenticated";
  }, [_value]);
  // memoize all of the signals and any errors into a single state object
  const _state = React.useMemo(
    () => ({
      status: _status,
      isLoading,
      isRefreshing,
      error: _error,
    }),
    [_error, isLoading, isRefreshing, _status],
  );
  // a callback for handling any errors that occur
  const _handleError = React.useCallback((error: string) => {
    // set the error state
    _setError(error);
    // if an onError callback is provided, invoke it
    if (onError) onError(error);
    // log the error
    logger.error(error);
  }, [onError]);
  /** clear the cached username */
  const _clearCache = React.useCallback(() => {
    // ensure that the window object is available
    if (typeof window === "undefined") return;
    // clear the cached username
    try {
      window.localStorage.removeItem(CACHE_KEY_USERNAME);
      logger.info("Cleared the cached username...");
    } catch (err) {
      _setError("Unable to clear the cached username");
    }
    return;
  }, []);
  /** cache the username */
  const _cache = React.useCallback(
    (value: string) => {
      // ensure the window is defined
      if (typeof window === "undefined") return;
      // cache the username
      try {
        window.localStorage.setItem(CACHE_KEY_USERNAME, value);
        logger.info("Successfully cached the username");
      } catch (err) {
        _setError("Failed to cache username");
      }
    },
    [_clearCache],
  );
  // a callback to handle changes to the username
  const handleOnChange = React.useCallback(
    (newUsername?: string | null, options?: { clearOnDefault?: boolean }) => {
      // deconstruct the options and set the default value
      const { clearOnDefault = false } = options ?? {};
      // update the local store
      _setValue(newUsername ?? null);
      // handle the caching of the value
      if (newUsername && newUsername.trim() !== "") {
        // cache the username and exit
        return _cache(newUsername);
      } else if (clearOnDefault) {
        // clear the cache if the username is set to default
        return _clearCache();
      }
    },
    [_cache, _clearCache],
  );
  // invoke the "public.username" function deployed on the database using supabase's "rpc" method
  const _get = React.useCallback(async (): Promise<string | null> => {
    // trace the event
    logger.trace("Fetching the username from the database...");
    // use the client to call the rpc function
    const { data, error } = await supabase.rpc("username");
    // handle any errors that occur
    if (error) {
      // set the current error state
      _setError(error.message);
      // return null
      return null;
    }
    // log the event
    logger.info("Successfully fetched the username from the database");
    // set the username state variable
    handleOnChange(data);
    // return the username
    return data;
  }, [supabase, handleOnChange]);
  // this callback is used to trigger a refresh of the current username
  const _onRefresh = React.useCallback(async (): Promise<void> => {
    // double check that we aren't already loading
    if (isLoading) {
      logger.warn("already loading; skipping refresh...");
      return Promise.resolve();
    }
    // ensure the refreshing state is toggled
    if (!isRefreshing) setIsRefreshing(true);
    // trace the event
    logger.trace("Refreshing the username...");
    //
    return _get().then(() => logger.info("Refreshed the username!")).finally(
      () => setIsRefreshing(false),
    );
  }, [isRefreshing, isLoading, _get]);
  // handle the subscription to the auth state changes
  const createAuthSubscription = React.useCallback(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // check if the user is logged in
      if (session) {
        const { user } = session;
        if (event === "SIGNED_IN") {
          // fetch the username from the database
          if (
            !user.user_metadata.username ||
            user.user_metadata.username === ""
          ) {
            await _get();
          } else {
            handleOnChange(user.user_metadata.username);
          }
        }
      }
      if (event === "SIGNED_OUT") {
        // nullify the state and clear the cache
        handleOnChange(null);
      }
    });
    return subscription;
  }, [
    supabase.auth,
    _value,
    _get,
    handleOnChange,
  ]);
  // loading effects
  React.useEffect(() => {
    // if the loading state is true, automatically invoke the onLoad callback
    if (isLoading) {
      _get().finally(() => setIsLoading(false));
    }
    return () => {
      // ensure the loading state is set to false on unmount
      setIsLoading(false);
    };
  }, [isLoading, _get]);
  // error effects
  React.useEffect(() => {
    if (_error) _handleError(_error);
  }, [_error, _handleError]);
  // synconize the cached username with the local state
  React.useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === CACHE_KEY_USERNAME) {
        _setValue(e.newValue ?? null);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  // subscribe to the auth state changes
  React.useEffect(() => {
    // on null, initialize the subscription
    if (!authSubRef.current) {
      authSubRef.current = createAuthSubscription();
    }
    return () => {
      // cleanup the auth subscription
      if (authSubRef.current) {
        authSubRef.current.unsubscribe();
        authSubRef.current = null;
      }
    };
  }, [authSubRef]);

  // redefine any public-facing variables
  const state = _state;
  const status = _status;
  const username = _value ?? undefined;
  // redeclare external methods
  const refresh = _onRefresh;
  // memoize the output
  return React.useMemo(() => ({ state, status, username, refresh }), [
    state,
    status,
    username,
    refresh,
  ]);
};
