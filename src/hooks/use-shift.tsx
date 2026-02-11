/**
 * Created At: 2025.10.26:11:10:46
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-shift.tsx
 */
'use client';
// imports
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
// project
import { deleteShift, getShift, ShiftData } from '@/features/shifts';
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { Database } from '@/types/database.types';

namespace UseShift {
  export interface Props {
    shiftId?: string;
    username?: string;
    supabase?: ReturnType<typeof createBrowserClient<Database, 'rms'>>;
    onError?: (error?: unknown) => void;
    onValueChange?: (data: ShiftData | null) => void;
    onDelete?: (id?: string) => void;
  }

  export interface State {
    isDeleting: boolean;
    isError: boolean;
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
  onError,
  onValueChange,
  onDelete,
  supabase = createBrowserClient<Database, 'rms'>('rms'),
}: UseShift.Props = {}): UseShift.Context => {
  // initialize the shifts state
  const [_data, _setData] = useState<ShiftData | null>(null);
  const [_error, _setError] = useState<Error | null>(null);
  const _channel = useRef<RealtimeChannel | null>(null);
  // define the various signals of the hooks
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // determine if the current user is the owner of the shift
  const isOwner = useMemo(
    () => username === _data?.assignee,
    [username, _data?.assignee],
  );

  const state = useMemo<UseShift.State>(
    () => ({
      isError: Boolean(_error),
      isDeleting,
      isLoading,
      isOwner,
      isReloading,
    }),
    [isDeleting, isLoading, isOwner, isReloading, _error],
  );

  const _handleChange = useCallback(
    (data: ShiftData | null) => {
      _setData((prev) => {
        if (prev == data) return prev;
        if (onValueChange) onValueChange(data);
        return data;
      });
    },
    [onValueChange],
  );
  // handle any errors
  const _handleError = useCallback(
    (err: unknown) => {
      _setError((prev) => {
        const error = err instanceof Error ? err : new Error(String(err));
        if (prev === err) return prev;
        if (onError) onError(error.message);
        logger.error(error, error.message);
        return error;
      });
    },
    [onError],
  );
  // create a loader callback
  const _get = useCallback(
    async (id: string): Promise<void> => {
      await getShift(id).then(_handleChange).catch(_handleError);
    },
    [_handleChange, _handleError],
  );
  // create a delete callback
  const _delete = useCallback(async (): Promise<void> => {
    if (!shiftId) {
      _handleError('No shift id provided');
      return Promise.reject('No shift id provided');
    }
    if (!isDeleting) setIsDeleting(true);
    return await deleteShift(shiftId)
      .then(() => {
        logger.debug(`Deleted shift with id: ${shiftId}`);
        _setData(null);
      })
      .catch(_handleError)
      .finally(() => setIsDeleting(false));
  }, [shiftId, supabase, _handleError]);
  // define a manual reloader
  const _reload = useCallback(async (): Promise<void> => {
    if (!shiftId) {
      _handleError('No shift id provided');
      return Promise.reject('No shift id provided');
    }
    if (!isReloading) setIsReloading(true);
    return await _get(shiftId)
      .catch((err) => logger.error(err))
      .finally(() => setIsReloading(false));
  }, [_get, shiftId]);
  // load the shifts
  useEffect(() => {
    // if we have a shift id, load the shift
    if (isLoading && shiftId) {
      _get(shiftId).finally(() => setIsLoading(false));
    }
  }, [isLoading, shiftId]);
  // real-time: subscribe to shift changes and update the cache
  useEffect(() => {
    if (!shiftId) return;
    // Setup the real-time channel
    _channel.current ??= supabase.channel(`shift:${shiftId}`, {
      config: { private: true },
    });
    _channel.current
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'rms',
          table: 'shifts',
          filter: `id=eq.${shiftId}`,
        },
        ({
          eventType,
          new: newData,
        }: RealtimePostgresChangesPayload<ShiftData>) => {
          logger.trace({ event: eventType }, 'Received a profile change event');
          if (['INSERT', 'UPDATE'].includes(eventType)) {
            _handleChange(newData as ShiftData);
          } else if (eventType === 'DELETE') {
            _handleChange(null);
          }
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.debug(`Subscribed to shifts changes for id: ${shiftId}`);
        } else if (status === 'TIMED_OUT') {
          logger.warn(
            `Subscription to shifts changes timed out for id: ${shiftId}`,
          );
        } else if (status === 'CLOSED') {
          logger.warn(
            `Subscription to shifts changes closed for id: ${shiftId}`,
          );
          _channel.current = null;
        }
      });

    return () => {
      if (_channel.current) {
        supabase.realtime.removeChannel(_channel.current);
        _channel.current = null;
      }
    };
  }, [supabase, _channel, username, _handleChange]);

  // create the context
  return useMemo(
    () => ({
      error: _error,
      data: _data,
      state,
      delete: _delete,
      reload: _reload,
    }),
    [_data, _error, state, _reload, _delete],
  );
};
