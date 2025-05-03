/**
 * Created At: 2025-04-04:20:05:11
 * @author - @FL03
 * @description - useAuth hook for managing authentication state and user information.
 * @file - use-auth.tsx
 */
'use client';
// imports
import * as React from 'react';
import {
  AuthChangeEvent,
  Session,
  Subscription,
  User,
} from '@supabase/supabase-js';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { HookCallback } from '@/types';

type SupabaseAuthStateHandler = (
  event: AuthChangeEvent,
  session: Session | null
) => void | Promise<void>;

type HookState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

type HookProps = {
  client?: ReturnType<typeof createBrowserClient>;
  onAuthStateChange?: SupabaseAuthStateHandler;
};

type HookReturn = {
  getUser: () => Promise<User>;
  session: Session | null;
  state: HookState;
  user?: User;
  userId?: string;
  username?: string;
};

export const useSupabaseAuth: HookCallback<HookProps, HookReturn> = ({
  client,
  onAuthStateChange,
} = {}) => {
  const supabase = client ?? createBrowserClient();
  // store the subscription to the auth state changes as a reference
  const authSubRef = React.useRef<Subscription | null>(null);
  const _state = React.useRef<HookState>({
    isLoading: true,
    isAuthenticated: false,
  });
  // local state
  const [_session, _setSession] = React.useState<Session | null>(null);
  const [_user, _setUser] = React.useState<User | undefined>();
  // loading states
  const [_isAuthenticated, _setIsAuthenticated] = React.useState(false);
  const [_isSessionLoading, _setIsSessionLoading] = React.useState(true);
  const [_isUserLoading, _setIsUserLoading] = React.useState(false);

  // this callback handles auth state changes
  const _createAuthSub = React.useCallback(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // log the event
      logger.trace(
        { event, id: session?.user?.id },
        'Detected a change of auth state...'
      );
      // if a method is passed, call it with the event and session
      // data **before** executing the default behaviors
      if (onAuthStateChange) await onAuthStateChange(event, session);

      // update the local session
      _setSession(session);

      if (event === 'SIGNED_OUT') {
        logger.info('Signing out the current user...');
        // nullify the local user instance
        _setUser(undefined);
      }
      if (session) {
        const { user } = session;
        _setIsAuthenticated(true);
        if (
          [
            'PASSWORD_RECOVERY',
            'SIGNED_IN',
            'TOKEN_REFRESH',
            'USER_UPDATED',
          ].includes(event)
        ) {
          logger.info(
            {
              event,
            },
            'Reflecting the updated user instance in the local state...'
          );
          // update the local user instance
          _setUser(user);
        }
      }
    });
    return subscription;
  }, [supabase, _setIsAuthenticated, _setSession, _setUser, onAuthStateChange]);
  // use the supabase client to get the session
  const _getSession = React.useCallback(async (): Promise<Session | null> => {
    if (!_isSessionLoading) _setIsSessionLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        logger.error(error, 'Error getting supabase auth session');
        throw error;
      }
      if (!session) {
        _setIsAuthenticated(false);
        return null;
      }
      _setSession(session);
      _setUser(session.user);
      return session;
    } catch (error) {
      logger.error(error, 'Error getting supabase auth session');
      throw error;
    } finally {
      _setIsSessionLoading(false);
    }
  }, [
    supabase,
    _isSessionLoading,
    _setIsSessionLoading,
    _setSession,
    _setUser,
  ]);
  // use the supabase client to get the user
  const _getUser = React.useCallback(async (): Promise<User> => {
    if (!_isUserLoading) _setIsUserLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        logger.error(error, 'Error getting user');
        throw error;
      }
      _setUser(data.user);
      return data.user;
    } catch (error) {
      logger.error(error, 'Error getting user');
      throw error;
    } finally {
      _setIsUserLoading(false);
    }
  }, [supabase, _isUserLoading, _setIsUserLoading, _setUser]);

  // session loading effects
  React.useEffect(() => {
    if (_isSessionLoading) _getSession();
    // handle unmounting
    return () => {
      // cleanup loading states
      _setIsSessionLoading(false);
    };
  }, [_isSessionLoading, _setIsSessionLoading, _getSession]);
  // user loading effects
  React.useEffect(() => {
    if (_isUserLoading) _getUser();
    // handle unmounting
    return () => {
      // cleanup loading states
      _setIsUserLoading(false);
    };
  }, [_isUserLoading, _setIsUserLoading, _getUser]);
  // realtime effects
  React.useEffect(() => {
    authSubRef.current ??= _createAuthSub();

    // handle unmounting
    return () => {
      // cleanup realtime effects
      authSubRef.current?.unsubscribe();
      authSubRef.current &&= null;
    };
  }, [_createAuthSub]);

  React.useEffect(() => {
    if (_isAuthenticated !== _state.current.isAuthenticated) {
      _state.current.isAuthenticated = _isAuthenticated;
    }
    if (_isSessionLoading !== _state.current.isLoading) {
      _state.current.isLoading = _isSessionLoading;
    }
    if (_isUserLoading !== _state.current.isLoading) {
      _state.current.isLoading = _isUserLoading;
    }
  }, [_state, _isAuthenticated, _isSessionLoading, _isUserLoading]);

  // redeclare public state
  const session = _session;
  const state = _state.current;
  const user = _user;
  const getUser = _getUser;

  return React.useMemo(
    () => ({
      getUser,
      session,
      state,
      user,
      userId: user?.id,
      username: user?.user_metadata.username,
    }),
    [session, state, user, getUser]
  );
};
