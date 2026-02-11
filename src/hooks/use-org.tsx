/**
 * Created At: 2025.10.31:11:27:24
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-org.tsx
 */
'use client';
// imports
import * as React from 'react';
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// project
import {
  deleteOrganization,
  fetchOrganization,
  OrganizationData,
} from '@/features/orgs';
import { logger } from '@/lib/logger';
import {
  createBrowserClient,
  realtimeSubscriptionHandler,
} from '@/lib/supabase';
import { OrgsDatabase } from '@/types/database.types';

namespace UseOrg {
  export interface State {
    isError: boolean;
    isLoading: boolean;
    isReloading: boolean;
    isDeleting: boolean;
  }

  export interface Context {
    data: OrganizationData | null;
    error: Error | null;
    state: State;
    delete(): Promise<void>;
    reload(): Promise<void>;
  }

  export interface Props {
    id?: string | null;
    supabase?: ReturnType<typeof createBrowserClient<OrgsDatabase, 'orgs'>>;
    staleTime?: number;
    onError?(error: Error): void;
    onDataChange?(data?: OrganizationData | null): void;
  }
  export type Callback = (options?: Props) => Context;
}

export const useOrg: UseOrg.Callback = ({
  id,
  supabase = createBrowserClient<OrgsDatabase, 'orgs'>('orgs'),
  staleTime = 1000 * 60, // 1 minute
  onError,
  onDataChange,
} = {}) => {
  const queryClient = useQueryClient();
  const channelRef = React.useRef<RealtimeChannel | null>(null);

  const queryKey = React.useMemo(() => ['organization', id ?? 'unknown'], [id]);

  // React Query: fetch organization
  const {
    data: orgData,
    error: queryError,
    isLoading,
    isFetching: isReloading,
    refetch,
  } = useQuery<OrganizationData | null>({
    queryKey,
    staleTime,
    queryFn: async () => (id ? await fetchOrganization(id) : null),
    enabled: Boolean(id),
  });

  // Delete mutation
  const { mutateAsync: deleteMutateAsync, isPending: isDeleting } = useMutation(
    {
      mutationFn: async () => {
        if (!id) throw new Error('No organization ID provided for deletion.');
        return deleteOrganization(id);
      },
      onSuccess: async () => {
        queryClient.removeQueries({ queryKey, exact: true });
        onDataChange?.(null);
        logger.info(`Deleted organization ${id} and cleared cache`);
      },
      onError: (err) => {
        logger.error(err, 'Failed to delete organization');
        onError?.(err as Error);
      },
    },
  );

  // Realtime subscription: update cache on postgres changes
  React.useEffect(() => {
    if (!id) return;

    // avoid double subscribing
    if (channelRef.current) return;

    const channel = supabase
      .channel(`org-id:${id}`, { config: { private: true } })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'orgs',
          table: 'organizations',
          filter: `id=eq.${id}`,
        },
        ({
          eventType,
          ...payload
        }: RealtimePostgresChangesPayload<OrganizationData>) => {
          logger.trace({ eventType }, 'Received an organization change event');
          const newRow = payload.new as OrganizationData | null;

          if (eventType === 'INSERT') {
            queryClient.setQueryData(queryKey, newRow ?? null);
            onDataChange?.(newRow ?? null);
          } else if (eventType === 'UPDATE') {
            queryClient.setQueryData<OrganizationData | null>(
              queryKey,
              (prev) =>
                prev && newRow ? { ...prev, ...newRow } : (newRow ?? null),
            );
            const latest =
              queryClient.getQueryData<OrganizationData | null>(queryKey) ??
              null;
            onDataChange?.(latest ?? null);
          } else if (eventType === 'DELETE') {
            queryClient.setQueryData(queryKey, null);
            onDataChange?.(null);
          }
        },
      )
      .subscribe(realtimeSubscriptionHandler());

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        // remove channel via realtime API
        supabase.realtime.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [id, supabase, queryClient, queryKey, onDataChange]);

  const reload = React.useCallback(async (): Promise<void> => {
    if (!id) {
      const err = new Error('No organization ID provided for reload.');
      onError?.(err);
      return Promise.reject(err);
    }
    await refetch().catch((err) => {
      logger.error(err, 'Error reloading organization');
      onError?.(err as Error);
    });
  }, [id, refetch, onError]);

  const remove = React.useCallback(async (): Promise<void> => {
    try {
      await deleteMutateAsync();
    } catch (err) {
      logger.error(err, 'Error deleting organization');
      onError?.(err as Error);
      return Promise.reject(err);
    }
  }, [deleteMutateAsync, onError]);

  const state = React.useMemo<UseOrg.State>(
    () => ({
      isError: Boolean(queryError),
      isLoading,
      isReloading,
      isDeleting,
    }),
    [queryError, isLoading, isReloading, isDeleting],
  );

  return React.useMemo(
    () => ({
      data: orgData ?? null,
      error: (queryError as Error) ?? null,
      state,
      delete: remove,
      reload,
    }),
    [orgData, queryError, state, remove, reload],
  );
};
