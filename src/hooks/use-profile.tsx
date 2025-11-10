/**
 * Created At: 2025-04-08:12:14:28
 * @author - @FL03
 * @description - Hooks for working with authenticated users and their profiles
 * @file - use-profile.tsx
 */
"use client";
// imports
import { useEffect, useMemo, useRef } from "react";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// project
import {
  getUserProfile,
  ProfileData,
  upsertUserProfile,
} from "@/features/profiles";
import { createBrowserClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { PublicDatabase } from "@/types/database.types";
// hooks
import { useUsername } from "./use-username";

namespace UseUserProfile {
  export type Callback = (options?: Props) => Context;

  export interface Props {
    supabase?: ReturnType<typeof createBrowserClient<any, "public">>;
    username?: string;
    userId?: string;
    onValueChange?(profile: ProfileData | null): void;
    onError?(error?: unknown): void;
    onRefresh?(profile: ProfileData | null): void;
    onSave?(profile: ProfileData | null): void;
  }

  export interface State {
    isError: boolean;
    isLoading: boolean;
    isReloading: boolean;
    isUpdating: boolean;
  }

  export interface Context {
    error: Error | null;
    isOwner: boolean;
    state: State;
    profile: ProfileData | null;
    username?: string;
    userId?: string;
    reload: () => void;
    update: (value: Partial<ProfileData>) => Promise<ProfileData | null>;
  }
}

/** The `useUserProfile` hook effectively materializes the current user-profile object from the database within the application. */
export const useUserProfile: UseUserProfile.Callback = (
  {
    supabase = createBrowserClient<PublicDatabase, "public">("public"),
    onValueChange,
    onError,
    onSave,
    username: usernameProp,
    userId,
  } = {},
) => {
  const currentUser = useUsername();

  // React Query: fetch and cache the profile
  const queryClient = useQueryClient();

  // Compute the effective username
  const username = useMemo(() => {
    if (usernameProp && usernameProp.trim() !== "") return usernameProp;
    if (currentUser.username && currentUser.username.trim() !== "") {
      return currentUser.username;
    }
    return undefined;
  }, [usernameProp, currentUser.username]);

  const isOwner = useMemo(() => currentUser.username === username, [
    currentUser.username,
    username,
  ]);

  const queryKey = useMemo(() => {
    if (username) return ["profile", username];
    else if (userId) return ["profile", "id", userId];
    else return ["profile", "unknown"];
  }, [username, userId]);

  const {
    data: profile,
    isError: isQueryError,
    isLoading,
    isFetching: isReloading,
    refetch: reload,
    error: queryError,
  } = useQuery<ProfileData | null>({
    queryKey,
    queryFn: () => {
      if (!username && !userId) return Promise.resolve(null);
      return getUserProfile({ username, userId });
    },
    enabled: Boolean(username) || Boolean(userId),
    staleTime: 1000 * 60, // 1 minute
  });

  // React Query: mutation for updating the profile
  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      if (!username) {
        throw new Error("No username provided; cannot update profile");
      }
      const updated = await upsertUserProfile({ username, ...updates });
      if (onValueChange) onValueChange(updated ?? null);
      if (onSave) onSave(updated ?? null);
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
        (
          { eventType, new: payload }: RealtimePostgresChangesPayload<
            ProfileData
          >,
        ) => {
          logger.trace({ event: eventType }, "Received a profile change event");
          if (["INSERT", "UPDATE"].includes(eventType)) {
            // Update the cache with the new profile data
            queryClient.setQueryData(
              ["profile", username],
              payload as ProfileData,
            );
            onValueChange?.(payload as ProfileData);
          } else if (eventType === "DELETE") {
            queryClient.setQueryData(["profile", username], null);
            onValueChange?.(null);
          }
        },
      )
      .subscribe(async (status, err) => {
        if (err) {
          logger.error(err, "Error with real-time profile subscription");
          return Promise.reject(err);
        }
        logger.info(
          { status },
          "Real-time profile subscription status changed",
        );
        if (status === "SUBSCRIBED") {
          // Initial fetch to sync the profile data
          const freshProfile = await getUserProfile({ username });
          queryClient.setQueryData(
            ["profile", username],
            freshProfile as ProfileData,
          );
          onValueChange?.(freshProfile);
        }
        if (status === "CLOSED") {
          channelRef.current = null;
        }
        return Promise.resolve();
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.realtime.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [supabase, channelRef, username, queryClient, onValueChange]);

  // Compose state
  const state = useMemo<UseUserProfile.State>(
    () => ({
      isLoading,
      isError: isQueryError,
      isReloading,
      isUpdating,
    }),
    [isQueryError, isLoading, isReloading, isUpdating],
  );

  return useMemo(
    () => ({
      error: queryError,
      profile: profile ?? null,
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
