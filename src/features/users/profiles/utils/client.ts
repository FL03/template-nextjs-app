/**
 * Created At: 2025-04-09:18:50:51
 * @author - @FL03
 * @file - client.ts
 */
"use client";
// project
import { logger } from "@/lib/logger";
import { createEndpointUrl, resolveOrigin } from "@/lib/utils";
// feature-specific
import { ProfileData } from "../types";
import { createBrowserClient } from "@/lib/supabase";
import { SupaSubscriptionCallback } from "@/types/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

const BASEPATH = "/api/users";

const profilesEndpoint = (path?: string) => createEndpointUrl(BASEPATH, path);

/** Fetch the user profile from the database using the dedicated api.  */
export const fetchUserProfile = async (
  params?: { uid?: string; username?: string } | { [key: string]: any },
  init?: RequestInit,
): Promise<ProfileData | null> => {
  // check if params is an object and has keys
  if (typeof params !== "object" || Object.keys(params).length === 0) {
    logger.warn(params, "Missing search params");
  }
  // ensure undefined or null params are not passed to the URL
  const _params = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([_, value]) => value !== undefined && value !== null,
    ),
  );
  // transform params to URLSearchParams
  const searchParams = new URLSearchParams(_params);
  // construct the url object
  const url = profilesEndpoint();
  // set the search params
  url.search = searchParams.toString();
  // fetch the data from the url
  const res = await fetch(url, init);
  // handle any response errors
  if (!res.ok) {
    logger.error(res, "Failed to fetch data from the database...");
    throw new Error("Failed to fetch the user profile");
  }
  // parse json
  const data = await res.json();
  // return the data or default to null
  return data ?? null;
};

export const deleteUserProfile = async (
  params?: Record<string, string>,
  init?: RequestInit,
): Promise<ProfileData | null> => {
  if (!params) {
    throw new Error("No params provided");
  }
  const url = profilesEndpoint("user");
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, { method: "DELETE", ...init }).then((res) =>
    res.json()
  );
};

type OnProfileChangeOptions = {
  userId?: string;
  username?: string;
  onChange?: React.Dispatch<Partial<ProfileData> | null>;
  onSubscribe?: SupaSubscriptionCallback;
};

/** Thhis method initializes a realtime channel for listening to changes to a particular entry, or profile, that has the given username. */
export const onProfileChange: (
  opts: OnProfileChangeOptions,
) => RealtimeChannel = (
  { userId, username, onChange, onSubscribe }: OnProfileChangeOptions = {},
) => {
  if (!username && !userId) {
    logger.error(
      "To create a realtime channel, either the `userId` or `username` must be provided.",
    );
    throw new Error("Channel Error: No `username` or `userId` provided");
  }
  let _filter;
  if (username) {
    _filter = `username=eq.${username}`;
  } else if (userId) {
    _filter = `id=eq.${userId}`;
  } else {
  }
  // create a supabase client
  const supabase = createBrowserClient();
  // define the subscription
  return supabase
    .channel(`profiles:${username}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
        filter: _filter,
      },
      (payload) => {
        if (payload.new) onChange?.(payload.new);
      },
    )
    .subscribe(onSubscribe);
};
