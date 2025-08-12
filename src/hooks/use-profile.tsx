/**
 * Created At: 2025-04-08:12:14:28
 * @author - @FL03
 * @description - Hooks for working with authenticated users and their profiles
 * @file - use-profile.tsx
 */
"use client";
// imports
import { useEffect, useMemo, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// project
import {
  fetchUserProfile,
  ProfileData,
  upsertProfile,
} from "@/features/profiles";
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { Database } from "@/types/database.types";
// hooks
import { useUsername } from "./use-username";

type HookProps = {
  client?: ReturnType<typeof createBrowserClient<any, "public">>;
  userId?: string;
  onValueChange?: (profile?: ProfileData | null) => void;
  onError?: (error?: unknown) => void;
  onRefresh?: (profile?: ProfileData | null) => void;
  onSave?: (profile?: ProfileData | null) => void;
};

type HookState = {
  isLoading: boolean;
  isReloading: boolean;
  isUpdating: boolean;
};

type UseUserProfileReturnT = {
  isOwner: boolean;
  state: HookState;
  profile?: ProfileData;
  username?: string;
  userId?: string;
  reload: () => void;
  update: (value: Partial<ProfileData>) => Promise<ProfileData | null>;
};

export const useUserProfile = (
  alias?: string,
  options?: HookProps,
): UseUserProfileReturnT => {
  const { client, onError, onValueChange } = options || {};
  const supabase = client ?? createBrowserClient<Database, "public">();
  // access the current user
  const currentUser = useUsername();

  // Compute the effective username
  const username = useMemo(() => {
    if (alias && alias.trim() !== "") return alias;
    if (currentUser.username && currentUser.username.trim() !== "") {
      return currentUser.username;
    }
    return undefined;
  }, [alias, currentUser.username]);

  const isOwner = useMemo(() => currentUser.username === username, [
    currentUser.username,
    username,
  ]);

  // React Query: fetch and cache the profile
  const queryClient = useQueryClient();
  const {
    data: profile,
    isError: isQueryError,
    isLoading,
    isFetching: isReloading,
    refetch: reload,
    error: queryError,
  } = useQuery<ProfileData | null>({
    queryKey: ["profile", username],
    queryFn:
      () => (username ? fetchUserProfile({ username }) : Promise.resolve(null)),
    enabled: !!username,
    staleTime: 1000 * 60, // 1 minute
  });

  // React Query: mutation for updating the profile
  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      if (!username) {
        throw new Error("No username provided; cannot update profile");
      }
      const updated = await upsertProfile({ username, ...updates });
      if (onValueChange) onValueChange(updated ?? null);
      if (options?.onSave) options.onSave(updated ?? null);
      return updated;
    },
    onSuccess: (data) => {
      // Invalidate and refetch the profile query
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      logger.info("Profile updated and cache invalidated");
    },
    onError: (err) => {
      logger.error(err, "Error updating user profile");
      if (onError) onError(err);
    },
  });

  // Real-time: subscribe to profile changes and update the cache
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!username) return;
    // Setup the real-time channel
    const channel = supabase
      .channel(`profiles:${username}`, { config: { private: true } })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `username=eq.${username}`,
        },
        ({ eventType, new: newData }) => {
          logger.trace(`[${eventType}] Real-time profile update received`);
          if (["INSERT", "UPDATE"].includes(eventType)) {
            // Update the cache with the new profile data
            queryClient.setQueryData(
              ["profile", username],
              newData as ProfileData,
            );
            if (onValueChange) onValueChange(newData as ProfileData);
          } else if (eventType === "DELETE") {
            queryClient.setQueryData(["profile", username], null);
            if (onValueChange) onValueChange(null);
          }
        },
      )
      .subscribe(handleRealtimeSubscription);

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        supabase.realtime.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [supabase, username, queryClient, onValueChange]);

  // Compose state
  const state = useMemo(
    () => ({
      isLoading,
      isQueryError,
      isReloading,
      isUpdating,
    }),
    [isQueryError, isLoading, isReloading, isUpdating],
  );

  return useMemo(
    () => ({
      error: queryError,
      profile: profile ?? undefined,
      state,
      username: profile?.username ?? username,
      userId: profile?.id,
      isOwner,
      reload,
      update,
    }),
    [profile, queryError, state, username, isOwner, reload, update],
  );
};

export default useUserProfile;
