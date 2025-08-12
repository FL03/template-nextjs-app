/**
 * Created At: 2025.08.11:20:01:00
 * @author - @FL03
 * @file - use-notebook.tsx
 */
"use client";
// imports
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
// project
import {
  fetchNotifications,
  Notification,
  NotificationData,
} from "@/features/notifications";
import { logger } from "@/lib/logger";
import {
  createBrowserClient,
  handleRealtimeSubscription,
  RealtimeSupabaseHandler,
} from "@/lib/supabase";
import type { PublicDatabase } from "@/types/database.types";
// hooks
import { useUsername } from "./use-username";

type HookStateT = {
  isFetching: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isDeleting: boolean;
  isRefreshing: boolean;
  error?: string | null;
};

type HookParams = {
  username?: string | null;
  onSubscription?: RealtimeSupabaseHandler;
  onNotificationChange?: (
    payload: RealtimePostgresChangesPayload<NotificationData>,
  ) => void;
};

type UseNotificationsReturnT = {
  data: Notification[];
  state: HookStateT;
  deleteNotification: (id: string) => Promise<NotificationData | null>;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<NotificationData | null>;
  updateStatus: (
    id: string,
    status: string,
  ) => Promise<NotificationData | null>;
};

type UseNotificationsHookT = (
  options?: HookParams,
) => UseNotificationsReturnT;

/**
 * The `useNotifications` hook provides access to the user's notifications.
 * @param {HookParams} params - The parameters for the hook.
 * @returns
 */
export const useUserNotifications: UseNotificationsHookT = (
  {
    username: usernameProp,
    onSubscription,
  }: HookParams = {},
): UseNotificationsReturnT => {
  // instantiate the client-side supabase client
  const supabase = createBrowserClient<PublicDatabase, "public">();
  // get the current username with the hook
  const currentUser = useUsername({ client: supabase });
  // resolve the username
  const username = usernameProp || currentUser?.username;
  // setup a reference to the realtime channel
  const _channel = useRef<RealtimeChannel | null>(null);
  // initialize the stateful stores
  const [_data, _setData] = useState<Notification[]>([]);
  // setup the error state
  const [error, setError] = useState<string | null>(null);
  // initialize the various event-based signals for tracking the hook state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isUpdating] = useState<boolean>(false);
  // memoize the signals into a single state object
  const _state = useMemo<HookStateT>(
    () => ({
      isDeleting,
      isFetching,
      isLoading,
      isLoaded,
      isRefreshing,
      isUpdating,
      error,
    }),
    [
      error,
      isDeleting,
      isFetching,
      isLoading,
      isLoaded,
      isRefreshing,
      isUpdating,
    ],
  );
  // double check the username
  if (!username || username.trim() === "") {
    logger.warn("No valid username was passed to the useNotifications hook!");
  }
  // fetch all of the notifications for the user
  const _fetchAll = useCallback(
    async (userName: string): Promise<Notification[]> => {
      // ensure the fetching state is set
      if (!isFetching) setIsFetching(true);
      // trace the event
      logger.trace("Fetching notifications for user:");
      // try to fetch the notifications
      try {
        // fetch the notifications for the user using the api
        const data = await fetchNotifications({ username: userName });
        // update the local state
        _setData(data);
        // return the data
        return data;
      } catch (error) {
        const err = error ? (error as Error).message : "Unknown error";
        // set the error state
        setError("Failed to fetch notifications: " + err);
        // return an empty array
        return [];
      } finally {
        // set the fetching state to false
        setIsFetching(false);
      }
    },
    [isFetching],
  );
  // a callback for refreshing the notifications
  const _refresh = useCallback(async () => {
    // ensure a username is provided
    if (!username || username.trim() === "") {
      return setError("No username provided for refreshing notifications.");
    }
    // ensure that the loading signal is toggled
    if (!isRefreshing) setIsRefreshing(true);
    logger.trace("Refreshing notifications...");
    // fetch the notifications for the user
    const data = await _fetchAll(username).finally(() =>
      setIsRefreshing(false)
    );
    logger.info(`Refreshed notifications for user: ${username}`);
    return;
  }, [isRefreshing, username, _fetchAll]);

  // delete a notification by its id
  const _deleteNotificationById = useCallback(
    async (id: string): Promise<NotificationData | null> => {
      // ensure the deleting state is set
      if (!isDeleting) setIsDeleting(true);
      // trace the event
      logger.trace("Deleting notification with id: " + id);
      // use the client to delete the notification
      const { data, error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .select()
        .single();
      // handle any errors with the query
      if (error) {
        // set the error state
        setError(error.message);
        // return null if there was an error
        return null;
      }
      // remove the notification from the local state
      _setData((prev) => prev.filter((i) => id === i.id));
      // set the deleting state to false
      setIsDeleting(false);
      // return the deleted notification
      return data;
    },
    [supabase],
  );
  // update the status of a notification
  const _updateStatus = useCallback(
    async (id: string, status: string): Promise<NotificationData | null> => {
      const { data, error } = await supabase
        .from("notifications")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        // set the error state
        setError(error.message);
        // return null
        return null;
      }
      _setData((prev) =>
        prev.map((item) => (item.id === data.id ? { ...item, ...data } : item))
      );
      return data;
    },
    [supabase],
  );
  // mark a notification as read
  const _markNotificationAsRead = useCallback(
    async (id: string) => _updateStatus(id, "read"),
    [_updateStatus],
  );
  // create a realtime channel for detecting changes to the notifications table
  const _createChannel = useCallback(
    (u: string) => {
      return supabase
        .channel(`notifications:${u}`, { config: { private: true } })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `username=eq.${u}`,
          },
          (payload) => {
            const data = payload.new as Notification;

            if (payload.eventType === "INSERT") {
              logger.info("Creating the store...");
              _setData((prev) => [...prev, data]);
            }
            if (payload.eventType === "UPDATE") {
              logger.info("Updating the store...");
              _setData((prev) =>
                prev.map((item) => {
                  if (item.id === data.id) {
                    return { ...item, ...data };
                  }
                  return item;
                })
              );
            }
            if (payload.eventType === "DELETE") {
              logger.info("Deleting the exercise...");
              _setData((prev) => prev.filter((item) => item.id !== data.id));
            }
          },
        )
        .subscribe((status, err) => {
          handleRealtimeSubscription(status, err);
          if (onSubscription) onSubscription(status, err);
        });
    },
    [supabase],
  );
  // loading effects
  useEffect(() => {
    // perform an initial load
    if (isLoading && username) {
      _fetchAll(username).finally(() => setIsLoaded(true));
    }
    return () => {
      // cleanup the loading state(s)
      setIsLoading(false);
      setIsLoaded(false);
    };
  }, [
    _fetchAll,
    isLoading,
    username,
  ]);
  // error effects
  useEffect(() => {
    if (error) {
      logger.error(error);
      // reset the error state
      setError(null);
    }
  }, [error]);
  // realtime effects
  useEffect(() => {
    if (username) {
      // if the channel is not created, create it
      _channel.current ??= _createChannel(username);
    }
    return () => {
      // handle the channel cleanup
      if (_channel.current) {
        // unsubscribe from the channel
        _channel.current?.unsubscribe();
        // remove the channel
        supabase.realtime.removeChannel(_channel.current);
        // nullify the channel
        _channel.current = null;
      }
    };
  }, [username, _channel, _createChannel]);
  // redeclare external variables
  const data = _data;
  const state = _state;
  // redeclare public methods
  const deleteNotification = _deleteNotificationById;
  const refresh = _refresh;
  const markAsRead = _markNotificationAsRead;
  const updateStatus = _updateStatus;

  // return the memoized values
  return useMemo(
    () => ({
      data,
      state,
      deleteNotification,
      refresh,
      markAsRead,
      updateStatus,
    }),
    [data, state, deleteNotification, refresh, markAsRead, updateStatus],
  );
};
