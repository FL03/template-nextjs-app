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
import { CACHE_KEY_USERNAME } from "@/lib/config";
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase";

namespace UseUsername {
  export interface Props {
    client?: ReturnType<typeof createBrowserClient<any, "public">>;
    onDataChange?(data: string): void;
    onError?(error: unknown): void;
  }

  export interface State {
    isError: boolean;
    isLoading: boolean;
    isReloading: boolean;
  }

  export type Context = {
    username?: string;
    error: Error | null;
    state: State;
    reload(): Promise<void>;
  }

  export type Callback = (options?: Props) => Context;
}

/**
 * The `useUsername` hook is a custom React hook for managing the current user's username; the hook primarily relies upon the database function `public.username` to fetch the username,
 * invoking it with a browser-side supabase client. However, it also manages the cache for the username in the browser's local storage, allowing for quick access to the username without
 * needing to fetch it from the database every time. Moreover, the hook subscribes to authentication state changes, allowing it to update the username, and the hook state,
 * whenever the current user signs in or out.
 *
 * @returns {HookReturnT} A memoized object containg the current user's username alongisde additional information for managing the username state.
 */
export const useUsername: UseUsername.Callback = ({
  client,
  onError,
}: UseUsername.Props = {}): UseUsername.Context => {
  // initialize the supabase client
  const supabase = client ?? createBrowserClient();
  // initialize stateful variables
  const [_value, _setValue] = React.useState<string | null>(null);
  const [_error, _setError] = React.useState<Error | null>(null);
  // create a ref to store the auth subscription
  const authSubRef = React.useRef<Subscription | null>(null);
  // define the various signals of the hook
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReloading, setIsReloading] = React.useState(false);
  // memoize all of the signals and any errors into a single state object
  const state = React.useMemo(
    () => ({
      isError: Boolean(_error),
      isLoading,
      isReloading,
    }),
    [_error, isLoading, isReloading],
  );
  // a callback for handling any errors that occur
  const handleError = React.useCallback((value: unknown) => {
    _setError((prev) => {
      const error = value instanceof Error ? value : new Error(String(value));
      if (prev === error) return prev;
      if (onError) onError(error);
      return error;
    });
  }, [onError]);
  /** clear the cached username */
  const _clearCache = React.useCallback(() => {
    // ensure that the window object is available
    if (typeof window === "undefined") return;
    // clear the cached username
    try {
      window.localStorage.removeItem(CACHE_KEY_USERNAME);
      logger.trace("Cleared the cached username...");
    } catch (err) {
      handleError(err);
    }
    return;
  }, [handleError]);
  /** cache the username */
  const _cache = React.useCallback(
    (value: string) => {
      // ensure the window is defined
      if (typeof window === "undefined") return;
      // cache the username
      try {
        window.localStorage.setItem(CACHE_KEY_USERNAME, value);
        logger.trace("Successfully cached the username");
      } catch (err) {
        handleError("Failed to cache username: " + String(err));
      }
    },
    [handleError],
  );
  // a callback to handle changes to the username
  const handleOnChange = React.useCallback(
    (newUsername?: string | null) => {
      // update the local store
      _setValue((prev) => {
        if (prev === newUsername) return prev;
        if (!newUsername) _clearCache();
        else _cache(newUsername);
        return newUsername ?? null;
      });
    },
    [_cache, _clearCache],
  );
  // invoke the "public.username" function deployed on the database using supabase's "rpc" method
  const _get = React.useCallback(async (): Promise<void> => {
    const { data, error } = await supabase.rpc("username");
    if (error) {
      handleError(error);
    }
    handleOnChange(String(data));
  }, [supabase, handleError, handleOnChange]);
  // this callback is used to trigger a refresh of the current username
  const reload = React.useCallback(async (): Promise<void> => {
    // double check that we aren't already loading
    if (isLoading) {
      logger.warn("already loading; skipping refresh...");
      return Promise.resolve();
    }
    // ensure the refreshing state is toggled
    if (!isReloading) setIsReloading(true);
    // trace the event
    logger.trace("Refreshing the username...");
    return _get().then(() => logger.info("Refreshed the username!")).finally(
      () => setIsReloading(false),
    );
  }, [isReloading, isLoading, _get]);
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
    if (_error) handleError(_error);
  }, [_error, handleError]);
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
  // memoize the output
  return React.useMemo(
    () => ({ username: _value ?? undefined, error: _error, state, reload }),
    [
      _error,
      _value,
      state,
      reload,
    ],
  );
};
