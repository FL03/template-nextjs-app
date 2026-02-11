/**
 * Created At: 2025-04-04:14:32:03
 * @author - @FL03
 * @description - Profile Provider Component for managing user profiles in a React application.
 * @file - provider.tsx
 */
'use client';
// imports
import * as React from 'react';
// hooks
import { useUserProfile } from '@/hooks/use-profile';

type ProfileContext = ReturnType<typeof useUserProfile>;

const ProfileContext = React.createContext<ProfileContext | null>(null);

/** create a profile context using values from the provider. */
export const useProfile = (): ProfileContext => {
  const context = React.useContext(ProfileContext);
  if (!context) {
    throw new Error('The `useProfile` must be used within a `ProfileProvider`');
  }
  return context;
};

/** The Profile Provider component uses the given username to manage the corresponding user profile */
export const UserProfileProvider: React.FC<
  React.PropsWithChildren<{ username: string }>
> = ({ children, username }) => {
  // use the hook for the context
  const { profile, state, ...userProfile } = useUserProfile({
    username,
  });

  // create the context object
  const ctx = React.useMemo(
    () => ({
      profile: profile,
      userId: profile?.id,
      username: profile?.username,
      state,
      ...userProfile,
    }),
    [profile, state, userProfile],
  );
  return (
    <ProfileContext.Provider value={ctx}>{children}</ProfileContext.Provider>
  );
};
UserProfileProvider.displayName = 'ProfileProvider';

export default UserProfileProvider;
