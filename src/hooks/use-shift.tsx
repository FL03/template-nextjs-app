/**
 * Created At: 2025.10.26:11:10:46
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-shift.tsx
 */
"use client";
// imports
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// project
import { deleteShift, getShift, ShiftData } from "@/features/shifts";
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase";
import { Database } from "@/types/database.types";

namespace UseShift {
  export interface Props {
    shiftId?: string;
    username?: string;
    supabase?: ReturnType<typeof createBrowserClient<Database, "rms">>;
    onError?: (error?: unknown) => void;
    onValueChange?: (data: ShiftData | null) => void;
    onDelete?: (id?: string) => void;
  }

  export interface State {
    isDeleting: boolean;
    isError: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isReloading: boolean;
    isOwner: boolean;
  }

  export interface Context {
    error: Error | null;
    data: ShiftData | null;
    state: State;
    delete(): Promise<void>;
    reload(): Promise<void>;
  }
}

/**
 * useShift - fetch + cache a single shift with react-query and keep a realtime channel
 * to update the cache when the server emits changes.
 */
export const useShift = ({
  shiftId,
  username,
  supabase,
  onError,
  onValueChange,
  onDelete,
}: UseShift.Props = {}): UseShift.Context => {
  const client = supabase ?? createBrowserClient<Database, "rms">("rms");

  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const queryKey = useMemo(() => ["shift", shiftId ?? "unknown"], [shiftId]);

  // React Query: fetch the shift
  const {
    data: shiftData,
    error: queryError,
    isLoading,
    isFetching,
    isRefetching: isReloading,
    refetch,
  } = useQuery<ShiftData | null>({
    queryKey,
    queryFn: async () => {
      if (!shiftId) return null;
      return await getShift(shiftId);
    },
    enabled: Boolean(shiftId),
    staleTime: 1000 * 15, // 15s; tune as needed
  });

  // Delete mutation
  const { mutateAsync: deleteMutateAsync, isPending: isDeleting } = useMutation(
    {
      mutationFn: async () => {
        if (!shiftId) throw new Error("No shift id provided");
        return deleteShift(shiftId);
      },
      onSuccess: async () => {
        // remove the cached shift and notify
        await queryClient.removeQueries({ queryKey, exact: true });
        onDelete?.(shiftId);
        logger.debug(`Deleted shift ${shiftId} and cleared cache`);
      },
      onError: (err) => {
        logger.error(err, "Failed to delete shift");
        onError?.(err);
      },
    },
  );

  // isOwner derived
  const isOwner = useMemo(() => username === shiftData?.assignee, [
    username,
    shiftData?.assignee,
  ]);

  const state = useMemo<UseShift.State>(() => ({
    isDeleting,
    isFetching,
    isLoading,
    isOwner,
    isReloading,
    isError: Boolean(queryError),
  }), [
    isDeleting,
    isFetching,
    isLoading,
    isOwner,
    isReloading,
    queryError,
  ]);

  // realtime subscription: update query cache on events
  useEffect(() => {
    if (!shiftId) return;

    const channel = client
      .channel(`shift:${shiftId}`, { config: { private: true } })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "rms",
          table: "shifts",
          filter: `id=eq.${shiftId}`,
        },
        (
          { eventType, ...payload }: RealtimePostgresChangesPayload<ShiftData>,
        ) => {
          logger.trace(
            { event: eventType, id: shiftId },
            "Detected a change to the shift",
          );
          const newRow = payload.new as Partial<ShiftData>;
          if (eventType === "DELETE") {
            queryClient.setQueryData(queryKey, null);
            onValueChange?.(null);
            return;
          } else if (eventType === "INSERT") {
            queryClient.setQueryData(queryKey, newRow as ShiftData);
            onValueChange?.(newRow as ShiftData);
            return;
          } else if (eventType === "UPDATE") {
            // merge updates into cached data
            queryClient.setQueryData<ShiftData | null>(queryKey, (prev) => {
              const updated = {
                ...(prev ?? {}),
                ...(newRow as Partial<ShiftData>),
              } as ShiftData;
              onValueChange?.(updated);
              return updated;
            });
            return;
          }
        },
      )
      .subscribe(async (status, err) => {
        if (err) {
          logger.error(err, "Realtime subscription error for shift");
          onError?.(err);
          return;
        }
        logger.debug(
          { status },
          `Realtime subscription status for shift ${shiftId}`,
        );
        if (status === "SUBSCRIBED") {
          // ensure query is fresh when subscribed
          try {
            const fresh = await getShift(shiftId);
            queryClient.setQueryData(queryKey, fresh ?? null);
            onValueChange?.(fresh ?? null);
          } catch (err) {
            logger.error(err, "Failed fetching fresh shift after subscribe");
          }
        }
        if (status === "CLOSED") {
          channelRef.current = null;
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        client.realtime.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [client, shiftId, queryClient, queryKey, onValueChange, onError]);

  // reload helper
  const reload = useCallback(async (): Promise<void> => {
    if (!shiftId) {
      onError?.("No shift id provided");
      return Promise.reject(new Error("No shift id provided"));
    }
    await refetch().catch((err) => {
      logger.error(err, "Error reloading shift");
      onError?.(err);
    });
  }, [shiftId, refetch, onError]);

  // delete helper
  const remove = useCallback(async (): Promise<void> => {
    try {
      await deleteMutateAsync();
    } catch (err) {
      logger.error(err, "Error deleting shift");
      onError?.(err);
      return Promise.reject(err);
    }
  }, [deleteMutateAsync, onError]);

  return useMemo(
    () => ({
      error: (queryError as Error) ?? null,
      data: shiftData ?? null,
      state,
      delete: remove,
      reload,
    }),
    [shiftData, queryError, state, remove, reload],
  );
};
