/**
 * Created At: 2025.08.10:13:16:51
 * @author - @FL03
 * @file - use-notifications.tsx
 */
'use client';
// imports
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// project
import {
  deleteNotification,
  getNotifications,
  NotificationData,
  updateNotification,
} from '@/features/notifications';
import { logger } from '@/lib/logger';
import {
  createBrowserClient,
  realtimeSubscriptionHandler,
  SupabaseOnSubscribeHandler,
} from '@/lib/supabase';
import type { Database } from '@/types/database.types';

namespace UseNotifications {
  export interface Props {
    username?: string | null;
    onError?(error: unknown): void;
    onSubscription?: SupabaseOnSubscribeHandler;
    onDataChange?(data: NotificationData[]): void;
  }

  export interface State {
    isFetching: boolean;
    isLoading: boolean;
    isDeleting: boolean;
    isReloading: boolean;
  }

  export interface Context {
    data: NotificationData[];
    state: State;
    error?: Error | null;
    deleteNotification(id: string): Promise<void>;
    reload(): Promise<void>;
    markAsRead(id: string): Promise<NotificationData | null>;
    updateStatus: (
      id: string,
      status: string,
    ) => Promise<NotificationData | null>;
  }
  export type Callback = (options?: Props) => Context;
}

/** The `useNotifications` hook provides access to the user's notifications.*/
export const useUserNotifications: UseNotifications.Callback = ({
  username,
  onError,
  onSubscription,
  onDataChange,
} = {}) => {
  const supabase = createBrowserClient<Database, 'account'>('account');
  const channelRef = useRef<RealtimeChannel | null>(null);
  const queryClient = useQueryClient();

  if (!username || username.trim() === '') {
    logger.warn('No valid username was passed to the useNotifications hook!');
  }

  // React Query: fetch notifications for the user
  const {
    data = [],
    error,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery<NotificationData[], Error>({
    queryKey: ['notifications', username ?? 'unknown'],
    queryFn: async () => {
      if (!username) return [];
      return await getNotifications({ username });
    },
    enabled: Boolean(username),
    staleTime: 1000 * 10, // 10s
  });

  // Delete mutation
  const { mutateAsync: deleteMutateAsync, isPending: isDeleting } = useMutation<
    void,
    unknown,
    string
  >({
    mutationFn: async (id: string) => {
      await deleteNotification(id);
    },
    onSuccess: (_data, id) => {
      // remove from cache
      queryClient.setQueryData<NotificationData[]>(
        ['notifications', username ?? 'unknown'],
        (prev = []) => prev.filter((n) => n.id !== id),
      );
    },
    onError: (err) => {
      logger.error(err, 'Failed to delete notification');
      onError?.(err);
    },
  });

  // Update mutation (used for markAsRead and general status changes)
  const { mutateAsync: updateMutateAsync } = useMutation<
    NotificationData,
    unknown,
    { id: string; updates: Partial<NotificationData> }
  >({
    mutationFn: async ({ id, updates }) => {
      const updated = await updateNotification({ id, ...updates });
      return updated as NotificationData;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<NotificationData[]>(
        ['notifications', username ?? 'unknown'],
        (prev = []) =>
          prev.map((n) => (n.id === updated.id ? { ...n, ...updated } : n)),
      );
    },
    onError: (err) => {
      logger.error(err, 'Failed to update notification');
      onError?.(err);
    },
  });

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      const res = await updateMutateAsync({ id, updates: { status } });
      return res;
    },
    [updateMutateAsync],
  );

  const markAsRead = useCallback(
    async (id: string) => {
      return updateStatus(id, 'read');
    },
    [updateStatus],
  );

  const reload = useCallback(async () => {
    if (!username) {
      onError?.('No username provided for refreshing notifications.');
      return;
    }
    await refetch().catch((err) => {
      logger.error(err, 'Error reloading notifications');
      onError?.(err);
    });
  }, [username, refetch, onError]);

  // Realtime channel: update cache on postgres changes
  useEffect(() => {
    if (!username || channelRef.current) return;

    const channel = supabase
      .channel(`notifications:${username}`, { config: { private: true } })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'account',
          table: 'notifications',
          filter: `username=eq.${username}`,
        },
        ({
          eventType,
          ...payload
        }: RealtimePostgresChangesPayload<NotificationData>) => {
          logger.trace({ eventType }, 'Received a notification change event');
          const newRow = payload.new as NotificationData;

          if (eventType === 'INSERT') {
            queryClient.setQueryData<NotificationData[]>(
              ['notifications', username],
              (prev = []) => {
                // avoid duplicates
                if (prev.some((p) => p.id === newRow.id)) return prev;
                return [...prev, newRow];
              },
            );
          } else if (eventType === 'UPDATE') {
            queryClient.setQueryData<NotificationData[]>(
              ['notifications', username],
              (prev = []) =>
                prev.map((item) =>
                  item.id === newRow.id ? { ...item, ...newRow } : item,
                ),
            );
          } else if (eventType === 'DELETE') {
            queryClient.setQueryData<NotificationData[]>(
              ['notifications', username],
              (prev = []) => prev.filter((item) => item.id !== newRow.id),
            );
          }

          // notify consumer
          const latest =
            queryClient.getQueryData<NotificationData[]>([
              'notifications',
              username,
            ]) ?? [];
          onDataChange?.(latest);
        },
      )
      .subscribe(realtimeSubscriptionHandler(onSubscription));

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.realtime.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [username, supabase, queryClient, onSubscription, onDataChange]);

  // sync on initial query result change to call onDataChange
  useEffect(() => {
    onDataChange?.(data);
  }, [data, onDataChange]);

  const state = useMemo<UseNotifications.State>(
    () => ({
      isFetching: Boolean(isFetching),
      isLoading: Boolean(isLoading),
      isDeleting: Boolean(isDeleting),
      isReloading: isRefetching,
    }),
    [isFetching, isLoading, isDeleting, isRefetching],
  );

  return useMemo(
    () => ({
      data,
      error: error ?? null,
      state,
      deleteNotification: deleteMutateAsync,
      reload,
      markAsRead,
      updateStatus,
    }),
    [data, error, state, deleteMutateAsync, reload, markAsRead, updateStatus],
  );
};
