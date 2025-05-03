/**
 * Created At: 2025-04-13:13:49:40
 * @author - @FL03
 * @file - provider.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Session, Subscription, User } from '@supabase/supabase-js';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/hooks/use-supabase';

type AuthContext = ReturnType<typeof useSupabaseAuth>;

const AuthContext = React.createContext<AuthContext | null>(null);

/** A hook dedicated to the supabase auth features */
export const useAuth = () => {
  const hookAuth = useSupabaseAuth();
  const context = React.useContext(AuthContext ?? hookAuth);
  if (!context) {
    logger.error('useAuth must be used within an `AuthProvider`; falling-back to the hook');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {};

export const AuthProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & AuthProviderProps
>(({ className, ...props }, ref) => {
  const supabase = createBrowserClient();
  // refs
  const _authSub = React.useRef<Subscription | null>(null);
  // initialize state variables
  const [_session, _setSession] = React.useState<Session | null>(null);
  const [_user, _setUser] = React.useState<User | undefined>();
  // stateful indicators
  const [_isAuthenticated, _setIsAuthenticated] = React.useState(false);
  const [_isLoading, _setIsLoading] = React.useState(true);
  // get the session and user
  const _getSession = React.useCallback(async (): Promise<Session | null> => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      logger.error({ error }, 'Error getting auth session');
      return null;
    }
    _setSession(session);
    _setUser(session?.user);
    return session;
  }, [supabase, _setSession, _setUser]);

  const _getUser = React.useCallback(async (): Promise<User> => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    // handle any errors
    if (error) {
      logger.error({ error }, 'Error getting user');
      throw new Error(error.message);
    }

    if (!user) {
      _setIsAuthenticated(false);
      throw new Error('User not found');
    }

    _setUser(user);
    _setIsAuthenticated(true);
    return user;
  }, [supabase, _isLoading, _setIsAuthenticated, _setUser]);

  const _createAuthSubscription = React.useCallback(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      logger.trace({ event, session }, 'Detected auth state change...');
      if (session) {
        _setIsAuthenticated(true);
        if (event === 'SIGNED_IN') {
          logger.trace({ userId: session.user.id }, 'User signed in');
          _setSession(session);
          _setUser(session.user);
        }
        if (event === 'TOKEN_REFRESHED') {
          _setSession(session);
        }
        if (event === 'USER_UPDATED') {
          _setUser(session.user);
        }
      }
      if (event === 'SIGNED_OUT') {
        _setSession(null);
        _setUser(undefined);
      }
    });
    return subscription;
  }, [supabase]);

  React.useEffect(() => {
    if (_isLoading) _getSession().finally(() => _setIsLoading(false));

    return () => {
      _setIsLoading(false);
    };
  }, [_isLoading, _getSession, _setIsLoading]);

  React.useEffect(() => {
    if (!_isAuthenticated && !_isLoading && _user) {
      _setIsAuthenticated(true);
    }

    return () => {
      // cleanup unmount
      _setIsAuthenticated(false);
    };
  }, [_isAuthenticated, _isLoading, _user, _setIsAuthenticated]);

  React.useEffect(() => {
    _authSub.current ??= _createAuthSubscription();
    return () => {
      if (_authSub.current) {
        _authSub.current.unsubscribe();
        _authSub.current = null;
      }
    };
  }, [_authSub]);

  const state = React.useMemo(
    () => ({ isAuthenticated: _isAuthenticated, isLoading: _isLoading }),
    [_isAuthenticated, _isLoading]
  );

  // redeclare stateful variables and public-facing methods
  const session = _session;
  const user = _user ?? undefined;
  const userId = _user?.id;
  const username = _user?.user_metadata?.username;
  const getUser = _getUser;

  const ctx = React.useMemo(
    () => ({
      session,
      user,
      userId,
      username,
      state,
      getUser,
    }),
    [session, state, user, userId, username, getUser]
  );
  return (
    <AuthContext.Provider value={ctx} {...props}>
      <div
        ref={ref}
        className={cn('flex-1 h-full w-full', className)}
        {...props}
      />
    </AuthContext.Provider>
  );
});
AuthProvider.displayName = 'AuthProvider';

export default AuthProvider;
