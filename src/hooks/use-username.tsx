/**
 * Created At: 2025-04-08:12:14:28
 * @author - @FL03
 * @description - Hooks for working with authenticated users and their profiles
 * @file - use-profile.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Subscription, SupabaseClient } from '@supabase/supabase-js';
// project
import { CACHE_KEY_USERNAME } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';

type HookOptions = {
  client?: SupabaseClient<any, 'public', any>;
  onDataChange?: (data: string | null) => void;
  onError?: (error: Error) => void;
};

type UsernameHookReturnT = {
  username: string;
  state: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
};

/**
 * Memoized hook for getting the current user's username; invokes the "public.username" function deployed on the database using
 * supabase's "rpc" method
 *
 * @returns the current user's username
 */
export const useUsername = (opts?: HookOptions): UsernameHookReturnT => {
  // initialize the supabase client
  const supabase = opts?.client ?? createBrowserClient();
  // initialize stateful variables
  const [_username, _setUsername] = React.useState<string | null>(null);
  // create a ref to store the auth subscription
  const authSubRef = React.useRef<Subscription | null>(null);
  // declare a loading state; default to true
  const [_isLoading, _setIsLoading] = React.useState(true);

  const [_isRefreshing, _setIsRefreshing] = React.useState(false);
  const _isAuthenticated = React.useMemo<boolean>(
    () => !!_username,
    [_username]
  );
  const _isMounted = React.useMemo<boolean>(
    () => typeof window !== 'undefined',
    []
  );

  // memoize all the non-data-bearing vars
  const _state = React.useMemo(
    () => ({
      isAuthenticated: _isAuthenticated,
      isLoading: _isLoading,
      isMounted: _isMounted,
    }),
    [_username, _isLoading]
  );
  /** cache the username */
  const _cacheUsername = React.useCallback((u?: string | null) => {
    if (!u) {
      // clear the cached username
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(CACHE_KEY_USERNAME);
          logger.info('successfully cleared the cached username');
        } catch (e) {
          logger.warn('Failed to clear cached username', e);
        }
      }
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(CACHE_KEY_USERNAME, u);
        logger.info('successfully cached the username:', u);
      } catch (e) {
        logger.warn('Failed to cache username', e);
      }
    }
  }, []);
  /** a callback to handle changes to the username */
  const _handleOnChange = React.useCallback(
    (data?: string | null) => {
      // check that the username has changed
      if (data !== _username) {
        // cache the username
        _cacheUsername(data);
        // update the local store
        _setUsername(data ?? null);
      }
    },
    [_username, _setUsername]
  );
  /** invoke the "public.username" function deployed on the database using supabase's "rpc" method */
  const _getUsername = React.useCallback(async (): Promise<string> => {
    logger.trace('useUsername', 'fetching username...');
    // use the client to call the rpc function
    const { data, error } = await supabase.rpc('username');
    // check for errors
    if (error) {
      logger.error(
        'Error fetching username from the database: ',
        error.message
      );
      throw new Error(error.message);
    }
    // log the event
    logger.info('Successfully fetched the username from the database', data);
    // set the username state variable
    _handleOnChange(data);
    // return the username
    return data;
  }, [_isLoading, supabase, _handleOnChange]);
  // loading effects
  React.useEffect(() => {
    if (_isLoading) _getUsername().finally(() => _setIsLoading(false));
    return () => {
      // ensure the loading state is set to false on unmount
      _setIsLoading(false);
    };
  }, [_getUsername, _setIsLoading, _isLoading]);
  // handle the subscription to the auth state changes
  const _initAuthSub = React.useCallback(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.trace('useUsername', 'auth state changed:', event, session);
      // check if the user is logged in
      if (session) {
        const { user } = session;
        if (event === 'SIGNED_IN') {
          // fetch the username from the database
          if (
            !user.user_metadata.username ||
            user.user_metadata.username === ''
          ) {
            await _getUsername();
          } else {
            _handleOnChange(user.user_metadata.username);
          }
        }
      }
      if (event === 'SIGNED_OUT') {
        // nullify the state and clear the cache
        _handleOnChange(null);
      }
    });
    return subscription;
  }, [supabase, _username, _getUsername, _handleOnChange, _setUsername]);
  // subscribe to the auth state changes
  React.useEffect(() => {
    // on null, initialize the subscription
    authSubRef.current ??= _initAuthSub();
    return () => {
      // unsubscribe from the auth state changes
      authSubRef.current?.unsubscribe();
      // nullify the auth subscription
      authSubRef.current &&= null;
    };
  }, [_initAuthSub, authSubRef]);

  // redeclare public vars & methods
  const username = _username || '';
  // set the username state variable
  const state = _state;

  const refresh = React.useCallback(async () => {
    // double check that we aren't already loading
    if (_isLoading) {
      logger.info('already loading; skipping refresh...');
      return;
    }
    // ensure the refreshing state is toggled
    if (!_isRefreshing) _setIsRefreshing(true);
    logger.trace('useUsername', 'fetching username...');
    //
    try {
      await _getUsername();
    } finally {
      _setIsLoading(false);
    }
  }, [_isRefreshing, _isLoading, _getUsername, _setIsLoading]);

  return React.useMemo(
    () => ({ state, username, refresh }),
    [state, username, refresh]
  );
};
