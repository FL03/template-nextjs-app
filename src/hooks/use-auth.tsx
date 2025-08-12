/**
 * Created At: 2025-04-04:20:05:11
 * @author - @FL03
 * @description - useAuth hook for managing authentication state and user information.
 * @file - use-auth.tsx
 */
"use client";
// imports
import * as React from "react";
import {
  AuthChangeEvent,
  Session,
  Subscription,
  User,
} from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase";
import { CACHE_KEY_USER_ID } from "@/lib/constants";

type SupabaseAuthStateHandler = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

type HookStateT = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

type OptsT = {
  supabase?: ReturnType<typeof createBrowserClient<any, "public">>;
  onAuthStateChange?: SupabaseAuthStateHandler;
  onError?: (error?: string) => void;
  onUserChange?: (user?: User | null) => void;
};

type AuthStatus = "unauthenticated" | "authenticated" | "guest";

type ReturnT = {
  getUser: () => Promise<User | null>;
  signOut: () => Promise<void>;
  session: Session | null;
  state: HookStateT;
  status: AuthStatus;
  user?: User;
  userId?: string;
  username?: string;
};

type HookT = (opts?: OptsT) => ReturnT;

/**
 * The `useAuth` hook is a custom wrapper around the Supabase authentication client, providing a way to manage user authentication state and actions.
 * It handles user session management, state changes, and provides methods for signing out and retrieving user information.
 * @param opts - Options for the useAuth hook
 * @returns - An object containing user authentication state and methods
 */
export const useAuth: HookT = (options) => {
  // destructure the options
  const { supabase = createBrowserClient(), onAuthStateChange } = options || {};
  // store the subscription to the auth state changes as a reference
  const authSubRef = React.useRef<Subscription | null>(null);
  // local state
  const [_session, _setSession] = React.useState<Session | null>(null);
  const [_user, _setUser] = React.useState<User | undefined>();
  // loading states
  const [loadingSession, setLoadingSession] = React.useState(true);
  const [loadingUser, setLoadingUser] = React.useState(false);
  // memoize the status of the auth session
  const authStatus = React.useMemo<AuthStatus>(
    () => {
      if (_session && _session?.user) return "authenticated";
      if (_session && !_session?.user) return "guest";
      return "unauthenticated";
    },
    [_session],
  );
  // declare the loading state
  const isLoading = React.useMemo(
    () => loadingSession || loadingUser,
    [loadingSession, loadingUser],
  );
  // memoize the various states for the hook to reduce re-renders
  const authState = React.useMemo(
    () => ({
      isAuthenticated: authStatus === "authenticated",
      isLoading,
    }),
    [authStatus, isLoading],
  );
  // clear the cached userId
  const clearCache = React.useCallback((): void => {
    // exit early if the window is not defined
    if (typeof window === "undefined") return;
    // try to clear the cache
    try {
      window.localStorage.removeItem(CACHE_KEY_USER_ID);
      logger.info("Successfully cleared the cached userId.");
    } catch (e) {
      logger.error(e, "Failed to clear the cached userId.");
    }
  }, []);

  /** cache the userId */
  const cache = React.useCallback(
    (userId?: string | null, options?: { clearByDefault?: boolean }): void => {
      // deconstruct the options and set their defaults
      const { clearByDefault = false } = options || {};
      // ensure the userId is defined
      if (typeof window === "undefined") return;
      // cache the userId if it is defined
      if (userId) {
        try {
          window.localStorage.setItem(CACHE_KEY_USER_ID, userId);
          logger.info("successfully cached the userId:");
        } catch (e) {
          logger.warn(e, "Failed to cache the userId");
        }
      } else if (clearByDefault) {
        // clear the cached userId
        return clearCache();
      } else {
        return logger.warn(
          "No userId provided to cache, skipping cache operation.",
        );
      }
    },
    [clearCache],
  );

  const _onUserChange = React.useCallback(
    (newUser?: User) => (
      // update the local user state
      _setUser((prev) => {
        // ensure the data has changed
        if (newUser === _user) return prev;
        // cache the userId
        cache(newUser?.id, { clearByDefault: true });
        // return the new state
        return newUser || undefined;
      })
    ),
    [cache],
  );
  // this callback handles auth state changes
  const setupAuthSubscription = React.useCallback(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // log the event
      logger.trace(
        { event, id: session?.user?.id },
        "Detected a change of auth state...",
      );
      // if a method is passed, call it with the event and session
      // data **before** executing the default behaviors
      if (onAuthStateChange) onAuthStateChange(event, session);

      // update the local session
      _setSession(session);

      if (event === "SIGNED_OUT") {
        logger.info("Signing out the current user...");
        // nullify the local user instance
        _onUserChange(undefined);
      }
      if (session) {
        const { user } = session;
        if (
          [
            "PASSWORD_RECOVERY",
            "SIGNED_IN",
            "TOKEN_REFRESH",
            "USER_UPDATED",
          ].includes(event)
        ) {
          logger.info(
            {
              event,
            },
            "Reflecting the updated user instance in the local state...",
          );
          // update the local user instance
          _onUserChange(user);
        }
      }
    });
    return subscription;
  }, [supabase.auth, onAuthStateChange, _onUserChange]);
  // use the supabase client to get the session
  const _loadSession = React.useCallback(async (): Promise<Session | null> => {
    if (!loadingSession) setLoadingSession(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        logger.error(error, "Error getting supabase auth session");
        throw error;
      }
      if (!session) {
        return null;
      }
      // set the session state
      _setSession(session);
      // update the user
      _onUserChange(session.user);
      return session;
    } catch (error) {
      logger.error(error, "Error getting supabase auth session");
      throw error;
    } finally {
      setLoadingSession(false);
    }
  }, [
    supabase,
    loadingSession,
  ]);
  // use the supabase client to get the user
  const loadUser = React.useCallback(async (): Promise<User> => {
    if (!loadingUser) setLoadingUser(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        logger.error(error, "Error getting user");
        throw error;
      }
      _setUser(data.user);
      return data.user;
    } catch (error) {
      logger.error(error, "Error getting user");
      throw error;
    } finally {
      setLoadingUser(false);
    }
  }, [supabase, loadingUser, _setUser]);
  // a callback handling the logout process for a user
  const _signOut = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error(error, "Unable to sign out the user");
      return Promise.reject(error);
    }
    logger.info("Successfully signed out the user...");
    // clear the cached userId
    clearCache();
    // reset the user state
    _setUser(undefined);
    // reset the session state
    _setSession(null);
    // resolve
    return Promise.resolve();
  }, [supabase.auth]);
  // session-specific loading effects
  React.useEffect(() => {
    if (loadingSession) _loadSession();
    // handle unmounting
    return () => {
      // cleanup loading states
      setLoadingSession(false);
    };
  }, [loadingSession, _loadSession]);
  // user-specific loading effects
  React.useEffect(() => {
    // trigger the user loading process if the session is loaded and the user is not
    if (loadingUser) loadUser();
    // handle unmounting
    return () => {
      // cleanup loading states
      setLoadingUser(false);
    };
  }, [loadingUser, loadUser]);
  // realtime-specific effects
  React.useEffect(() => {
    // if there isn't a reference to the subscription, create one
    if (!authSubRef.current) {
      authSubRef.current = setupAuthSubscription();
    }
    // handle unmounting
    return () => {
      // cleanup realtime effects
      if (authSubRef.current) {
        // unsubscribe from the auth state changes
        authSubRef.current.unsubscribe();
        // nullify the reference
        authSubRef.current = null;
      }
    };
  }, [setupAuthSubscription]);

  // redefine the output variables
  const session = _session;
  const user = _user;
  // redeclare any public methods
  const getUser = loadUser;
  const signOut = _signOut;
  // memoize and return the hook's output
  return React.useMemo(
    () => ({
      session,
      state: authState,
      status: authStatus,
      user,
      userId: user?.id,
      username: user?.user_metadata.username,
      getUser,
      signOut,
    }),
    [authState, authStatus, session, user, getUser, signOut],
  );
};
