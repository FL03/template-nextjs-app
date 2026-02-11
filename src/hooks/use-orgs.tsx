/**
 * Created At: 2025.09.23:19:51:53
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-organizations.tsx
 */
'use client';
// imports
import * as React from 'react';
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { OrgsDatabase } from '@/types/database.types';
// feature
import {
  deleteOrganization,
  fetchOrganizations,
  OrganizationData,
} from '@/features/orgs';

namespace UseOrgs {
  export interface State {
    isError: boolean;
    isLoading: boolean;
    isReloading: boolean;
    isUpdating: boolean;
  }

  export interface Context {
    data: OrganizationData[];
    error: Error | null;
    state: State;
    deleteOrg(id: string): Promise<void>;
    reload(): Promise<void>;
  }

  export type Props = {
    supabase?: ReturnType<typeof createBrowserClient<OrgsDatabase, 'orgs'>>;
    userId?: string;
    onError?(error: Error): void;
    onDataChange?(data: OrganizationData[] | null): void;
  };

  export type Callback = (options?: Props) => Context;
}
/**
 * The `useOrgs` hook works to materialize the `orgs.organizations` table locally. The hook provides access to the
 * organizations the user is _entitled_ to see, as well as methods to delete and reload the organizations.
 */
export const useOrgs: UseOrgs.Callback = ({
  supabase = createBrowserClient<OrgsDatabase, 'orgs'>('orgs'),
  userId,
  onError,
  onDataChange,
} = {}) => {
  // declare state
  const [_data, _setData] = React.useState<OrganizationData[]>([]);
  const [_error, _setError] = React.useState<Error | null>(null);
  const _channel = React.useRef<RealtimeChannel | null>(null);
  // define various signals of the hook
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isReloading, setIsReloading] = React.useState<boolean>(false);
  const [isUpdating] = React.useState<boolean>(false);

  const state = React.useMemo<UseOrgs.State>(
    () => ({
      isError: Boolean(_error),
      isDeleting,
      isLoading,
      isReloading,
      isUpdating,
    }),
    [_error, isDeleting, isLoading, isReloading, isUpdating],
  );

  const _handleChange = React.useCallback(
    (value?: OrganizationData[] | null): void => {
      _setData((prev) => {
        value ??= [];
        if (prev === value) return prev;
        onDataChange?.(value);
        return value;
      });
    },
    [onDataChange],
  );

  const _handleError = React.useCallback(
    (err: unknown = 'An unknown error occurred.') =>
      _setError((prev) => {
        const error = err instanceof Error ? err : new Error(String(err));
        if (prev === error) return prev;
        onError?.(error);
        return error;
      }),
    [onError],
  );

  const _get = React.useCallback(
    async (query?: {
      filterBy?: string;
      limit?: number;
      orderBy?: string;
    }): Promise<void> =>
      await fetchOrganizations(query).then(_handleChange).catch(_handleError),
    [_handleChange, _handleError],
  );

  const _delete = React.useCallback(
    async (id: string): Promise<void> => {
      if (!isDeleting) setIsDeleting(true);
      logger.trace({ id }, 'Deleting organization...');
      return await deleteOrganization(id)
        .then(() => _setData((prev) => prev.filter((item) => item.id !== id)))
        .catch(_handleError)
        .finally(() => setIsDeleting(false));
    },
    [isDeleting, _handleError],
  );

  const reload = React.useCallback(async (): Promise<void> => {
    if (isLoading) {
      logger.warn('Already loading the organizations; skipping reload.');
      return;
    }
    if (!isReloading) setIsReloading(true);
    return await _get().finally(() => setIsReloading(false));
  }, [_get, isLoading, isReloading]);

  const _initChannel = React.useCallback(
    ({
      key = 'created_by',
      value,
    }: Partial<{ key: keyof OrganizationData; value: string }> = {}) =>
      supabase.realtime
        .channel(`orgs_${key}=${value}`, {
          config: { private: false },
        })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'orgs',
            table: 'organizations',
            filter: `${key}=eq.${value}`,
          },
          ({
            eventType,
            ...payload
          }: RealtimePostgresChangesPayload<OrganizationData>) => {
            logger.trace(
              { event: eventType },
              'Detected changes within the orgs.organizations table...',
            );
            const newData = payload.new as OrganizationData;
            if (eventType === 'DELETE') {
              logger.trace(
                'Removing deleted organization from the local state...',
              );
              _setData((prev) =>
                !prev ? prev : prev.filter((item) => item.id !== newData.id),
              );
            }
            if (eventType === 'INSERT') {
              _setData((prev) => [newData, ...prev]);
            }
            if (eventType === 'UPDATE') {
              _setData((prev) =>
                prev.map((item) => (item.id === newData.id ? newData : item)),
              );
            }
          },
        ),
    [supabase.realtime, _channel],
  );

  React.useEffect(() => {
    if (isLoading) {
      _get().finally(() => setIsLoading(false));
    }
    return () => {
      setIsLoading(false);
    };
  }, [isLoading]);

  React.useEffect(() => {
    if (userId && !_channel.current) {
      _channel.current = _initChannel({ key: 'created_by', value: userId });
    }
    _channel.current?.subscribe(async (status) => {
      logger.debug({ status }, 'Channel subscription status');
      if (status === 'SUBSCRIBED') {
        // refetch the organizations
        await reload();
      } else if (status === 'TIMED_OUT') {
        logger.warn(
          'Channel subscription timed out. Attempting to resubscribe...',
        );
        _channel.current?.unsubscribe();
        _channel.current = _initChannel({ key: 'created_by', value: userId });
        _channel.current?.subscribe();
      } else if (status === 'CLOSED') {
        logger.warn('Channel subscription closed. Cleaning up...');
        _channel.current = null;
      }
    });
    return () => {
      if (_channel.current) {
        supabase.realtime.removeChannel(_channel.current);
        _channel.current = null;
      }
    };
  }, [supabase.realtime, _channel]);

  return React.useMemo(
    () => ({
      data: _data ?? [],
      error: _error,
      state,
      reload,
      deleteOrg: _delete,
    }),
    [_data, _error, state, reload, _delete],
  );
};
