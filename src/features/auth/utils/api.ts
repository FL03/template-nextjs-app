/**
 * Created At: 2025.10.24:22:59:44
 * @author - @FL03
 * @directory - src/features/auth/utils
 * @file - api.ts
 */
// types
import type { User } from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";

/** A client-side method for fetching the current user. */
export const getCurrentUser = async (
  init?: Omit<RequestInit, "method">,
): Promise<User | null> => {
  // execute a GET request to the endpoint
  const res = await fetch("/api/users/current-user", {
    ...init,
    method: "GET",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch the current user: " + res.statusText);
  }
  const { data, error } = await res.json();
  if (error) {
    logger.error(error, "Error fetching the current user...");
    throw new Error(error);
  }
  return data;
};
