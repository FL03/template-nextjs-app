/**
 * Created At: 2025-04-13:13:49:40
 * @author - @FL03
 * @file - auth/provider.tsx
 */
"use client";
// imports
import * as React from "react";
// hooks
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-profile";
// features
import { ProfileData } from "@/features/profiles";
import { User } from "@supabase/supabase-js";

type AuthContext = {
  authState: ReturnType<typeof useAuth>["state"];
  profile?: ProfileData;
  user?: User;
  userId?: string;
  username?: string;
};
// declare the current user context
const AuthContext = React.createContext<AuthContext | null>(null);

/** A hook dedicated to the supabase auth features */
export const useCurrentUser = () => {
  // try and get the context
  const context = React.useContext(AuthContext);
  // handle the case where the context is not available
  if (!context) {
    throw new Error(
      "`useCurrentUser` must be used within the bounds of an `UserAuthProvider`.",
    );
  }
  // return the context
  return context;
};

export const UserAuthProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  // call the use auth hook to get the context of the provider
  const { state: authState, user, ...auth } = useAuth();
  const { profile } = useUserProfile(user?.user_metadata?.username);

  // memoize the context
  const context = React.useMemo(() => ({
    ...auth,
    authState,
    profile,
    user,
    username: profile?.username
  }), [auth, authState, profile, user]);
  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};
UserAuthProvider.displayName = "UserAuthProvider";

export default UserAuthProvider;
