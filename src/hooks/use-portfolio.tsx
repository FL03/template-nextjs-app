/**
 * Created At: 2025.07.27:17:04:59
 * @author - @FL03
 * @file - portfolio/provider.tsx
 */
"use client";
// imports
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
import {
  fetchUserPortfolio,
  type PortfolioData,
} from "@/features/account/portfolio";
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from "@/lib/supabase";
import { Database } from "@/types/database.types";
// hooks
import { useUsername } from "./use-username";

type UsePortfolioState = {
  error?: string | null;
  isLoading: boolean;
  isOwner: boolean;
  isReloading: boolean;
  isUpdating: boolean;
};

type UsePortfolioReturnT = {
  data?: PortfolioData;
  state: UsePortfolioState;
};

type UsePortfolioOptions = {
  client?: ReturnType<typeof createBrowserClient<Database, "account">>;
  username?: string;
  onError?: (error: string | null) => void;
  onValueChange?: (data?: PortfolioData | null) => void;
};

/**
 * A hook for accessing and managing a user's portfolio data.
 * @param {UsePortfolioOptions} options - The options for the hook.
 * @returns {UsePortfolioReturnT} - An object containing the portfolio data and state.
 */
export const useUserPortfolio = (
  { client, username: usernameProp, onError, onValueChange }:
    UsePortfolioOptions,
): UsePortfolioReturnT => {
  // invoke the useUsername hook to get the username
  const { username: currentUsername } = useUsername();
  // if provided, use the username prop, otherwise use the current username
  const username = usernameProp ?? currentUsername;
  // memoize the ownership of the username
  const isOwner = useMemo(() => currentUsername === usernameProp, [
    currentUsername,
    usernameProp,
  ]);
  // initialize the supabase client
  const supabase = client ?? createBrowserClient<Database, "account">();
  // declare a reference to a realtime channel for the portfolio
  const channelRef = useRef<RealtimeChannel>(
    null,
  );
  // initialize the portfolio state
  const [_data, _setData] = useState<PortfolioData | null>(null);
  // declare a state to handle the provider error
  const [_error, _setError] = useState<string | null>(null);
  // define the necessary signals for the hook
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [isUpdating] = useState(false);
  // aggregate the signals into a single, memoized state
  const _state = useMemo(
    () => ({ isLoading, isOwner, isReloading, isUpdating, error: _error }),
    [
      isLoading,
      isOwner,
      isReloading,
      isUpdating,
      _error,
    ],
  );
  // a callback dedicated to handling data changes
  const handleChange = useCallback(
    (data?: PortfolioData | null) => {
      // set the data
      _setData(data ?? null);
      //if provided, invoke the onChange callback
      if (onValueChange) onValueChange(data);
    },
    [onValueChange],
  );
  // a callback dedicated to handling errors
  const handleError = useCallback(
    (error: string | null) => {
      // set the error
      _setError(error);
      // if provided, invoke the onError callback
      if (onError) onError(error);
    },
    [onError],
  );
  // a callback dedicated to fetching the portfolio data
  const _fetch = useCallback(
    (alias: string): Promise<PortfolioData | null> => (
      fetchUserPortfolio({ username: alias }).then((data) => {
        // handle the data change
        handleChange(data);
        // return the data
        return data;
      }).catch((error) => {
        // handle the error
        handleError(
          error instanceof Error ? error.message : "Unknown error",
        );
        return null;
      })
    ),
    [handleChange, handleError],
  );
  // a callback for creating a realtime channel for the portfolio
  const createChannel = useCallback(
    (
      alias: string,
    ) => (
      supabase.channel(`portfolio:${alias}`, { config: { private: true } })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "account",
            table: "portfolio",
            filter: `username=eq.${alias}`,
          },
          ({ new: newData, eventType }) => {
            logger.trace("Handling changes to the user portfolio...");
            const data = newData as PortfolioData;

            if (["INSERT", "UPDATE"].includes(eventType)) {
              handleChange(data);
            } else if (eventType === "DELETE") {
              logger.info("Deleting the user profile");
              handleChange(null);
            }
          },
        )
        .subscribe(handleRealtimeSubscription)
    ),
    [supabase.channel, handleChange],
  );
  // a callback dedicated to handling loading-specific workflows
  const _reload = useCallback(async (): Promise<void> => {
    // prevent a reload is the hook is loading
    if (isLoading) {
      logger.warn("Cannot reload while loading; skipping...");
      return;
    }
    // ensure the username is defined
    if (!username) {
      return handleError(
        "Username is not defined; cannot reload portfolio data...",
      );
    }
    // ensure the reloading state is toggled
    if (!isReloading) setIsReloading(true);
    // fetch the portfolio data
    await _fetch(username).then(() => {
      logger.info(
        `Successfully reloaded the user portfolio data for ${username}`,
      );
    }).finally(() => setIsReloading(false));
  }, [isReloading, username]);
  // error-specific effects
  useEffect(() => {
    // handle the case where an error is present
    if (_error) {
      // log the error
      logger.error(_error);
    }
    // handle the unmounting
    return () => {
      // ensure the error is nullified during the unmount
      if (_error) handleError(null);
    };
  }, [_error]);
  // loading effects
  useEffect(() => {
    // automatically fetch the data when loading
    if (isLoading && username) {
      _fetch(username).then(() => setIsLoading(false));
    }
    return () => {
      setIsLoading(false);
    };
  }, [isLoading]);
  // realtime effects
  useEffect(() => {
    // create a new channel if the username is defined and one isn't already created
    if (username && !channelRef.current) {
      channelRef.current = createChannel(username);
    }
    // cleanup on unmount
    return () => {
      if (channelRef.current) {
        // unsubscribe from the channel
        channelRef.current.unsubscribe();
        // remove the channel from the supabase client
        supabase.realtime.removeChannel(channelRef.current);
        // finally, nullify the channel reference
        channelRef.current = null;
      }
    };
  }, [channelRef, username, supabase.realtime, createChannel]);

  // redefine public variables
  const data = _data ?? undefined;
  const state = _state;
  // redeclare external methods
  const reload = _reload;
  // memoize the output
  return useMemo(() => ({ data, state, reload }), [data, state, reload]);
};

export default useUserPortfolio;
