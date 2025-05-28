/**
 * Created At: 2025-04-08:12:14:28
 * @author - @FL03
 * @description - Hooks for working with authenticated users and their profiles
 * @file - use-profile.tsx
 */
'use client';
// imports
import * as React from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
// project
import { fetchUserProfile, ProfileData } from '@/features/users';
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from '@/lib/supabase';
import logger from '@/lib/logger';
import { useUsername } from './use-username';
import { HookCallback } from '@/types';

type HookProps = {
  username?: string | null;
};

type HookState = {
  isLoading: boolean;
};
type HookOutput = {
  isOwner: boolean;
  profile: ProfileData | null;
  state: HookState;
  username: string;
  loadProfile: () => Promise<ProfileData | null>;
};

export const useUserProfile: HookCallback<HookProps, HookOutput> = (
  options?: HookProps
) => {
  // initialize the supabase client
  const supabase = createBrowserClient();
  // use the username hook to get the current users username
  const currentUser = useUsername({ client: supabase });
  // declare the a local username variable
  let username = options?.username;
  // handle the case where no username is passed
  if (!username || username.trim() === '') {
    logger.warn('No params provided; using current user');
    username = currentUser.username;
  }
  // check if the username being used is assigned to the current user
  const isOwner = currentUser.username === username;
  // initialize a state for managing the profile data
  const [_data, _setData] = React.useState<ProfileData | null>(null);
  // declare the loading state
  const [_isLoading, _setIsLoading] = React.useState<boolean>(true);

  const _state = React.useMemo(
    () => ({
      isLoading: _isLoading,
    }),
    [_isLoading]
  );

  // initialize a reference to the channel
  const _profileChannelRef = React.useRef<RealtimeChannel | null>(null);

  // create a callback for loading the profile data
  const _getProfile = React.useCallback(
    async (u: string): Promise<ProfileData | null> => {
      try {
        const data = await fetchUserProfile({ username: u });
        _setData(data);
        return data;
      } catch (error) {
        logger.error(error);
        throw error;
      }
    },
    [_setData]
  );
  // create a callback for loading the profile data
  const _loadUserProfile =
    React.useCallback(async (): Promise<ProfileData | null> => {
      if (!_isLoading) _setIsLoading(true);
      logger.trace('useUserProfile', 'loading user profile...');
      try {
        const profile = await _getProfile(username);
        logger.trace(
          { username: profile?.username, userId: profile?.id },
          'loaded user profile...'
        );
        return profile;
      } catch (error) {
        logger.error({ error }, 'Error loading user profile');
        throw error;
      } finally {
        _setIsLoading(false);
      }
    }, [username, _isLoading, _getProfile, _setIsLoading]);
  // a callback for creating a channel
  const _createProfileChannel = React.useCallback(
    (alias: string) => {
      return supabase
        .channel(`profiles:${alias}`, { config: { private: true } })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `username=eq.${alias}`,
          },
          (payload) => {
            const data = payload.new as ProfileData;

            if (['INSERT', 'UPDATE'].includes(payload.eventType)) {
              logger.trace(
                payload.eventType,
                'Updating the local instance of the users profile'
              );
              _setData(data);
            }
            if (['DELETE'].includes(payload.eventType)) {
              logger.info('Deleting the user profile');
              _setData(null);
            }
          }
        )
        .subscribe(handleRealtimeSubscription);
    },
    [supabase, _setData]
  );
  // loading-related effects
  React.useEffect(() => {
    if (_isLoading) _loadUserProfile();

    return () => {
      // when unmounting, ensure to prevent additional loads
      _setIsLoading(false);
    };
  }, [_isLoading, _loadUserProfile, _setIsLoading]);
  // realtime effects
  React.useEffect(() => {
    if (username) {
      // on null, create the profile channel
      _profileChannelRef.current ??= _createProfileChannel(username);
    }
    // handle component un-mounting
    return () => {
      // remove the channel
      if (_profileChannelRef.current) {
        // unsubscripe from the channel
        _profileChannelRef.current?.unsubscribe();
        supabase.realtime.removeChannel(_profileChannelRef.current);
        _profileChannelRef.current &&= null;
      }
    };
  }, [_profileChannelRef, supabase, _createProfileChannel]);
  // redeclare various parameters before returning
  const profile = _data;
  const loadProfile = _loadUserProfile;

  const state = _state;
  // return the memoized values
  return React.useMemo(() => {
    return {
      isOwner,
      profile,
      state,
      username,
      loadProfile,
    };
  }, [username, isOwner, profile, state, loadProfile]);
};

export default useUserProfile;
