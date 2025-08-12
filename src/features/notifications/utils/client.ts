/**
 * Created At: 2025-04-09:14:39:41
 * @author - @FL03
 * @description - Client-side utility functions for notifications
 * @file - client.ts
 */
"use client";
// project
import { logger } from "@/lib/logger";
import { filterSearchParamsObject, resolveOrigin } from "@/lib/endpoint";
import type { ApiQueryHandler } from "@/types";
// feature-specific
import type { NotificationData } from "../types";

const NOTIFICATION_API_ENDPOINT = "/api/notifications";

/**
 * Retrieve notifications for the user given their unique identifier.
 *
 * @param uid - The unique identifier of the user.
 * @param init - Optional request initialization parameters.
 * @return A promise that resolves to the user's notifications.
 */
export const fetchNotifications: ApiQueryHandler<
  { username?: string; limit?: string; offset?: string },
  NotificationData[]
> = async (params, init) => {
  // check if params is an object and has keys
  if (typeof params !== "object" || Object.keys(params).length === 0) {
    logger.warn(params, "Missing search params");
  }
  // filter out nullish parameters from the params object
  const searchParams = filterSearchParamsObject(params);
  // construct the url object
  const url = new URL(NOTIFICATION_API_ENDPOINT, resolveOrigin());
  // set the search params
  url.search = searchParams.toString();
  // fetch the data from the url
  const res = await fetch(url, init);
  // handle any response errors
  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.statusText}`);
  }
  // await the response and parse it as JSON
  const data = await res.json().then((data) => {
    // handle the case where data is not an array
    if (data && !Array.isArray(data)) {
      logger.error(
        "Expected an array of notifications, but received:",
      );
      return [];
    }
    // check if the data is empty
    if (!data || data.length === 0) {
      logger.warn("No notifications found for the user");
      return [];
    }
    // parse the data as NotificationData[]
    return data as NotificationData[];
  });
  return data;
};

export const deleteNotification = async (
  params: { id?: string },
  init: Omit<RequestInit, "method">,
) => {
  // check if params is an object and has keys
  if (typeof params !== "object" || Object.keys(params).length === 0) {
    logger.warn(params, "Missing search params");
  }
  // transform params to URLSearchParams
  const searchParams = filterSearchParamsObject(params);
  // construct the url object
  const url = new URL(NOTIFICATION_API_ENDPOINT, resolveOrigin());
  // set the search params
  url.search = searchParams.toString();
  // fetch the data from the url
  const res = await fetch(url, {
    ...init,
    method: "DELETE",
    headers: {
      ...init.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  // handle any response errors
  if (!res.ok) {
    logger.error(
      { status: res.statusText },
      "Failed to delete the notification",
    );
    throw new Error("Failed to delete the notification");
  }
  // parse json
  const data = await res.json();
  // return the data or empty array
  return data ?? null;
};
