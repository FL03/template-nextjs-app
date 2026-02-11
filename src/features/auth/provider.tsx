/**
 * Created At: 2025.10.22:17:34:59
 * @author - @FL03
 * @directory - src/features/auth
 * @file - provider.tsx
 */
'use client';
// imports
import * as React from 'react';
// hooks
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-profile';
// features
import { ProfileData } from '@/features/profiles';
import { cn } from '@/lib/utils';

interface CurrentUserContext extends Omit<ReturnType<typeof useAuth>, 'state'> {
  authState: ReturnType<typeof useAuth>['state'];
  profileState: ReturnType<typeof useUserProfile>['state'];
  profile: ProfileData | null;
  customerId?: string;
  subscriptionStatus?: string;
  email?: string;
  username?: string;
  user?: ReturnType<typeof useAuth>['user'];
  userId?: string;
  reloadUserProfile: ReturnType<typeof useUserProfile>['reload'];
}
// declare the current user context
const CurrentUserContext = React.createContext<CurrentUserContext | null>(null);

/** A hook for getting the context of the `CurrentUserProvider`.*/
export const useCurrentUser = () => {
  // try and get the context
  const context = React.useContext(CurrentUserContext);
  // handle the case where the context is not available
  if (!context) {
    throw new Error(
      '`useCurrentUser` must be used within the bounds of an `CurrentUserProvider`.',
    );
  }
  // return the context
  return context;
};

/**
 * The `CurrentUserProvider` works to provide a single synchronized context providing access to both the user object and the user profile.
 */
export const CurrentUserProvider: React.FC<
  React.ComponentPropsWithRef<'div'>
> = ({ ref, className, ...props }) => {
  const {
    state: authState,
    customerId,
    subscriptionStatus,
    user,
    ...auth
  } = useAuth();
  const { profile, ...userProfile } = useUserProfile({
    userId: user?.id,
  });

  // memoize the context
  const context = React.useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(user),
      authState,
      user,
      profile,
      profileState: userProfile.state,
      username: profile?.username,
      customerId: profile?.customer_id ?? customerId,
      subscriptionStatus: profile?.subscription_status ?? subscriptionStatus,
      reloadUserProfile: userProfile.reload,
    }),
    [
      auth,
      authState,
      profile,
      customerId,
      subscriptionStatus,
      user,
      userProfile,
    ],
  );
  return (
    <CurrentUserContext.Provider value={context}>
      <div
        ref={ref}
        className={cn('flex-1 h-full w-full', className)}
        {...props}
      />
    </CurrentUserContext.Provider>
  );
};
CurrentUserProvider.displayName = 'UserAuthProvider';

export default CurrentUserProvider;
