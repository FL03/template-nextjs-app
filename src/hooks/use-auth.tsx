/**
 * Created At: 2025-04-04:20:05:11
 * @author - @FL03
 * @description - useAuth hook for managing authentication state and user information.
 * @file - use-auth.tsx
 */
"use client";
// imports
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AuthChangeEvent,
  Session,
  Subscription,
  User,
  UserAttributes,
} from "@supabase/supabase-js";
// project
import { CACHE_KEY_USER_ID } from "@/lib/config";
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase";

namespace UseAuth {
  export type Callback = (options?: Props) => AuthContext;

  export type Status = "unauthenticated" | "authenticated" | "guest";

  export type LoadingState = "session" | "user" | null;

  export interface Props {
    supabase?: ReturnType<typeof createBrowserClient<any, "public">>;
    onAuthStateChange?(event: AuthChangeEvent, session: Session | null): void;
    onError?(error?: unknown): void;
    onUserChange?(user?: User | null): void;
  }

  export interface State {
    isAuthenticated: boolean;
    isError: boolean;
    isLoading: LoadingState;
  }

  export interface AuthMetadata {
    customerEmail?: string;
    customerId?: string;
    subscriptionStatus?: string;
    username?: string;
  }

  export interface AuthContext extends AuthMetadata {
    getUser(): Promise<User | null>;
    signOut(): Promise<void>;
    updateUser(values: UserAttributes): Promise<void>;
    // properties
    error: Error | null;
    session: Session | null;
    state: State;
    status: Status;
    user?: User;
    // user info
    email?: string;
    userId?: string;
  }
}
/**
 * The `useAuth` hook is a custom wrapper around the Supabase authentication client, providing a way to manage user authentication state and actions.
 * It handles user session management, state changes, and provides methods for signing out and retrieving user information.
 */
export const useAuth: UseAuth.Callback = (
  {
    onAuthStateChange,
    onError,
    onUserChange,
    supabase = createBrowserClient(),
  } = {},
) => {
  const authSubRef = useRef<Subscription | null>(null);
  const [_session, _setSession] = useState<Session | null>(null);
  const [_user, _setUser] = useState<User | null>(null);
  const [_error, _setError] = useState<Error | null>(null);

  const [isLoading, setIsLoading] = useState<UseAuth.LoadingState>("session");
  // Auth status
  const _status = useMemo<UseAuth.Status>(() => {
    if (_session?.user) return "authenticated";
    if (_session) return "guest";
    return "unauthenticated";
  }, [_session]);

  const _state = useMemo(
    () => ({
      isAuthenticated: _status === "authenticated",
      isError: Boolean(_error),
      isLoading,
    }),
    [_error, _status, isLoading],
  );

  // Error handler
  const handleError = useCallback(
    (err: unknown) => {
      const error = err instanceof Error
        ? err
        : new Error(String(err ?? "An unknown error occurred."));
      _setError((prev) => {
        if (prev?.message === error.message) return prev;
        onError?.(error);
        return error;
      });
    },
    [onError],
  );

  // Cache helpers
  const clearCache = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const cached = window.localStorage.getItem(CACHE_KEY_USER_ID);
      if (cached !== null) {
        window.localStorage.removeItem(CACHE_KEY_USER_ID);
        logger.info("Cleared cached userId.");
      }
    } catch (e) {
      handleError(e);
    }
  }, [handleError]);

  const cache = useCallback(
    (userId?: string | null) => {
      if (!userId || typeof window === "undefined") return;
      try {
        const cached = window.localStorage.getItem(CACHE_KEY_USER_ID);
        if (cached !== userId) {
          window.localStorage.setItem(CACHE_KEY_USER_ID, userId);
          logger.info({ userId }, "Cached userId updated.");
        }
      } catch (e) {
        handleError(e);
      }
    },
    [handleError],
  );

  // User change handler
  const _onUserChange = useCallback(
    (next?: User | null) => (
      _setUser((prev) => {
        if (prev?.id === next?.id) return prev;
        if (onUserChange) onUserChange(next);
        if (next) {
          cache(next.id);
          return next;
        } else {
          clearCache();
          return null;
        }
      })
    ),
    [cache, clearCache, onUserChange],
  );

  // Auth subscription
  const setupAuthSubscription = useCallback(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.trace(
          { event, id: session?.user?.id },
          "Detected a change of auth state...",
        );
        onAuthStateChange?.(event, session);
        _setSession(session);

        if (event === "SIGNED_OUT") {
          logger.info("Signing out the current user...");
          clearCache();
          _setUser(null);
        } else if (session?.user) {
          logger.info("Setting the current user...");
          _setUser(session.user);
          cache(session.user.id);
        }
      },
    );
    return subscription;
  }, [supabase.auth, cache, onAuthStateChange, clearCache]);

  // Load session
  const _getSession = useCallback(async (): Promise<void> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      handleError(error);
      return;
    }
    _setSession(data.session);
    _onUserChange(data.session?.user);
  }, [supabase.auth, _onUserChange, handleError]);

  // Load user
  const _loadUser = useCallback(async (): Promise<User | null> => {
    // prevent the user loading while session is loading
    if (isLoading === "session") {
      logger.warn(
        "Session is still loading, cannot fetch user at this time.",
      );
      return null;
    }
    if (isLoading === null) setIsLoading("user");
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }
      if (!user) {
        logger.warn({ scope: "useAuth" }, "No user found...");
      }
      _onUserChange(user);
      return user;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(null);
    }
  }, [supabase.auth, isLoading, _onUserChange, handleError]);

  const updateUser = useCallback(
    async (values: UserAttributes) => {
      await supabase.auth.updateUser(values).then(({ data, error }) => {
        if (error) {
          throw new Error(error.message);
        }
        _onUserChange(data.user);
      }).catch(handleError);
    },
    [supabase.auth, _onUserChange, handleError],
  );

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut().then(({ error }) => {
      if (error) {
        throw new Error(error.message);
      }
      logger.info("Successfully signed out the user...");
      _setSession(null);
      _onUserChange(null);
    }).catch(handleError);
  }, [supabase.auth, _onUserChange, handleError]);

  // Effects
  useEffect(() => {
    if (isLoading === "session") {
      _getSession().finally(() => setIsLoading(null));
    }
    if (isLoading === "user") {
      _loadUser().finally(() => setIsLoading(null));
    }
    return () => setIsLoading(null);
  }, [isLoading, _getSession]);

  useEffect(() => {
    if (!authSubRef.current) {
      authSubRef.current = setupAuthSubscription();
    }
    return () => {
      authSubRef.current?.unsubscribe();
      authSubRef.current = null;
    };
  }, [setupAuthSubscription]);

  // Output
  return useMemo<UseAuth.AuthContext>(
    () => ({
      error: _error,
      session: _session,
      state: _state,
      status: _status,
      user: _user ?? undefined,
      email: _user?.email,
      userId: _user?.id,
      customerEmail: _user?.user_metadata.customer_email?.toString(),
      customerId: _user?.user_metadata.customer_id?.toString(),
      subscriptionStatus: _user?.user_metadata.subscription_status?.toString(),
      username: _user?.user_metadata.username?.toString(),
      avatarUrl: _user?.user_metadata.avatar_url?.toString(),
      getUser: _loadUser,
      signOut: logout,
      updateUser,
    }),
    [_error, _state, _status, _session, _user, logout, updateUser, _loadUser],
  );
};
