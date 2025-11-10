/**
 * Created At: 2025.09.09:17:46:48
 * @author - @FL03
 * @file - use-schedule.tsx
 */
"use client";
import * as React from "react";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
// project
import {
  adjustShiftDate,
  deleteShift,
  getShifts,
  type ShiftData,
} from "@/features/shifts";
import { logger } from "@/lib/logger";
import {
  createBrowserClient,
  realtimeSubscriptionHandler,
} from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { toast } from "sonner";

namespace UseShifts {
  export interface Props {
    username?: string;
    onError?(error: string | null): void;
    onDataChange?(data: ShiftData[]): void;
  }

  export interface State {
    isDeleting: boolean;
    isUpdating: boolean;
    isLoading: boolean;
    isReloading: boolean;
    isError: boolean;
  }

  export interface Output {
    error: Error | null;
    data: ShiftData[] | null;
    state: State;
    deleteShift(id: string): Promise<void>;
    reload(): Promise<void>;
  }

  export type Hook = (options?: Props) => Output;
}

/** The `useShifts` hook provides access and controls for managing shifts associated with the current user. */
export const useShifts: UseShifts.Hook = (
  { username, onDataChange, onError } = {},
) => {
  // initialize the supabase client
  const supabase = createBrowserClient<Database, "rms">("rms");
  // initialize the shifts state
  const [_data, _setData] = React.useState<ShiftData[] | null>(null);
  const [_error, _setError] = React.useState<Error | null>(null);
  // define the various signals of the hooks
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isReloading, setIsReloading] = React.useState<boolean>(false);
  const [isUpdating] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  // aggregate the various signals into a single "hookState"
  const _state = React.useMemo<UseShifts.State>(() => ({
    isDeleting,
    isLoading,
    isReloading,
    isUpdating,
    isError: Boolean(_error),
  }), [isDeleting, isLoading, isReloading, isUpdating, _error]);
  // the error handler
  const handleError = React.useCallback((value: unknown): void => {
    _setError((prev) => {
      const error = value instanceof Error ? value : new Error(String(value));
      if (prev === error) return prev;
      logger.error(error, error.message);
      if (onError) onError(error.message);
      return error;
    });
  }, [onError]);
  // handle any changes to the data
  const handleDataChange = React.useCallback((data: ShiftData[]): void => {
    _setData((prev) => {
      if (data === prev) return prev;
      if (onDataChange) onDataChange(data);
      return data;
    });
  }, [onDataChange]);
  // create a loader callback
  const _fetch = React.useCallback(
    async (alias?: string): Promise<void> => {
      await getShifts({ assignee: alias }).then(handleDataChange).catch(
        handleError,
      );
    },
    [handleDataChange, handleError],
  );
  const _deleteShift = React.useCallback(async (id: string) => {
    if (!isDeleting) setIsDeleting(true);
    return await deleteShift(id).then(() => {
      logger.debug(`Deleted shift with id: ${id}`);
      _setData((v) => v?.filter((s) => s.id !== id) ?? null);
    }).catch(handleError).finally(() => setIsDeleting(false));
  }, [isDeleting, handleError]);
  // load the shifts
  React.useEffect(() => {
    // if null, load the shifts data
    if (isLoading && username) {
      _fetch(username).finally(() => setIsLoading(false));
    }
    // cleanup on unmount
    return () => {
      setIsLoading(false);
    };
  }, [_data, isLoading, username, _fetch]);
  // realtime effects
  const _channel = React.useRef<RealtimeChannel | null>(null);
  React.useEffect(() => {
    // if the channel is not initialized, initialize it
    if (!username) return;

    _channel.current = supabase
      .channel(`shifts:${username}`, { config: { private: true } })
      .on(
        "postgres_changes",
        {
          event: "*",
          filter: `assignee=eq.${username}`,
          schema: "rms",
          table: "shifts",
        },
        (
          { eventType, new: payload }: RealtimePostgresChangesPayload<
            ShiftData
          >,
        ) => {
          logger.trace(
            { event: eventType },
            "An event was detected on the channel; processing...",
          );
          // make sure any new data is correctly formatted
          const newData = payload as ShiftData;
          // handle any new shifts
          if (eventType === "INSERT") {
            logger.info("inserting a new shift...");
            _setData((prev) => (prev ? [...prev, newData] : [newData]));
          }
          // handle any updates made to a shift
          if (eventType === "UPDATE") {
            logger.info("updating a shift...");
            _setData((prev) => (
              prev?.map((i) => (i.id === newData.id ? newData : i)) ?? null
            ));
          }
          // remove any deleted shifts from the store
          if (eventType === "DELETE") {
            logger.info("removing the deleted shift from the local store...");
            _setData((prev) => (
              prev?.filter(({ id }) => id !== newData.id) ?? null
            ));
          }
        },
      )
      .subscribe(realtimeSubscriptionHandler());

    // cleanup on unmount
    return () => {
      if (_channel.current) {
        supabase.removeChannel(_channel.current);
        _channel.current = null;
      }
    };
  }, [supabase, _channel, username]);
  // manually trigger a reload of the shifts
  const reload = React.useCallback(async (): Promise<void> => {
    if (isLoading) {
      logger.warn("Already loading shifts, cannot reload");
      setIsReloading(false);
      return Promise.resolve();
    }
    if (!username) {
      logger.error(
        "Unable to reload the shifts for an unauthorized user",
      );
      setIsReloading(false);
      return Promise.reject(new Error("Unauthorized"));
    }
    if (!isReloading) setIsReloading(true);
    toast.promise(
      _fetch(username),
      {
        loading: "Reloading shifts...",
        success: "Shifts reloaded successfully!",
        error: "Failed to reload shifts.",
      },
    );
    setIsReloading(false);
  }, [isLoading, isReloading, username, _fetch, handleError]);
  return React.useMemo(
    () => ({
      data: _data?.map(adjustShiftDate) ?? null,
      error: _error,
      state: _state,
      deleteShift: _deleteShift,
      reload,
    }),
    [_data, _error, _state, _deleteShift, reload],
  );
};
