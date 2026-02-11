/**
 * Created At: 2025.10.24:22:58:40
 * @author - @FL03
 * @directory - src/features/notifications/utils
 * @file - api.ts
 */
// project
import { logger } from "@/lib/logger";
import { parseSearchParams, resolveOrigin } from "@/lib/utils";
// local
import type {
  NotificationData,
  NotificationInsert,
  NotificationUpdate,
  NotificationUpsert,
} from "../types";

const ENDPOINT = "/api/notifications";

const notificationEndpoint = (id?: string): string => (
  id ? `${ENDPOINT}/${id}` : ENDPOINT
);

/** A client-side method for fetching notifications for a given user. */
export const getNotifications = async (
  params?: {
    username?: string;
    userId?: string;
    limit?: string;
    offset?: string;
    filterBy?: string;
    sortBy?: string;
  },
  init?: Omit<RequestInit, "method">,
): Promise<NotificationData[]> => {
  // construct the url object
  const url = new URL(ENDPOINT, resolveOrigin());
  // set the search params
  url.search = parseSearchParams(params).toString();
  // fetch the data from the url
  const res = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    logger.error(
      res.status,
      `Failed to fetch notifications: ${res.statusText}`,
    );
    throw new Error("Failed to fetch notifications");
  }
  // await the response and parse it as JSON
  const { data, error } = await res.json();
  if (error) {
    logger.error(error, error.message);
    throw new Error(error);
  }
  return data ?? [];
};

export async function getNotification(
  { id }: { id?: string } = {},
  init?: Omit<RequestInit, "method">,
): Promise<NotificationData | null> {
  if (!id) {
    logger.error("No id provided to fetch a notification");
    return null;
  }
  const res = await fetch(notificationEndpoint(id), {
    ...init,
    method: "GET",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  // handle any response errors
  if (!res.ok) {
    logger.error(
      res.status,
      "Failed to fetch the notification: " + res.statusText,
    );
    return null;
  }
  // parse the response
  const { data, error } = await res.json();
  if (error) {
    logger.error(error, "Error fetching the notification");
    return null;
  }
  return data ?? null;
}

/** A client-side method that leverages the notifications api to remove a record with the given id. */
export async function deleteNotification(
  id: string,
  init?: Omit<RequestInit, "method">,
): Promise<NotificationData | null> {
  // fetch the data from the url
  const res = await fetch(notificationEndpoint(id), {
    ...init,
    method: "DELETE",
    headers: {
      ...init?.headers,
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
  // parse the response
  const { data, error } = await res.json();
  if (error) {
    logger.error(error, "Error deleting the notification");
    throw new Error(error);
  }
  return data ?? null;
}
/** Create a new notification */
export async function insertNotification(
  values: NotificationInsert,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<NotificationData | null> {
  const res = await fetch(notificationEndpoint(), {
    ...init,
    method: "PATCH",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
    body: values ? JSON.stringify(values) : undefined,
  });
  // handle any response errors
  if (!res.ok) {
    logger.error(
      { status: res.statusText },
      "Failed to update the notification",
    );
    throw new Error("Failed to update the notification");
  }
  const { data, error } = await res.json();
  if (error) {
    logger.error(error, "Error updating the notification");
    throw new Error(error);
  }
  return data ?? null;
}

export async function updateNotification(
  { id, ...values }: NotificationUpdate,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<NotificationData | null> {
  const res = await fetch(notificationEndpoint(id), {
    ...init,
    method: "PATCH",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
    body: values ? JSON.stringify(values) : undefined,
  });
  // handle any response errors
  if (!res.ok) {
    logger.error(
      { status: res.statusText },
      "Failed to update the notification",
    );
    throw new Error("Failed to update the notification");
  }
  const { data, error } = await res.json();
  if (error) {
    logger.error(error, "Error updating the notification");
    throw new Error(error);
  }
  return data ?? null;
}
/** Insert or update a notification with the given data; **note** this function requires the primary key(s) to exist. */
export async function upsertNotification(
  { id, ...values }: NotificationUpsert,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<NotificationData | null> {
  const res = await fetch(notificationEndpoint(id), {
    ...init,
    method: "POST",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
    body: values ? JSON.stringify(values) : undefined,
  });
  // handle any response errors
  if (!res.ok) {
    logger.error(
      { status: res.statusText },
      "Failed to update the notification",
    );
    throw new Error("Failed to update the notification");
  }
  const { data, error } = await res.json();
  if (error) {
    logger.error(error, "Error updating the notification");
    throw new Error(error);
  }
  return data ?? null;
}

/** Mark the notification with the given id as `read`; updating the status in the database. */
export async function markNotificationAsRead(
  id: string,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<NotificationData | null> {
  return updateNotification({ id, status: "read" }, init);
}
