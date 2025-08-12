/**
 * Created At: 2025.07.26:15:18:03
 * @author - @FL03
 * @file - queries.ts
 */
"use server";
// imports
import { SupabaseClient, User } from "@supabase/supabase-js";
// local
import { createServerClient } from "./server";

/**
 * An asynchronous, server-side function for
 * @returns {User} The current authenticated user.
 */
export const getCurrentUser = async (
  options?: { client: SupabaseClient },
): Promise<User> => {
  // use or initialize a server-side supabase client
  const supabase = options?.client || (await createServerClient());

  const currentUser = await supabase.auth.getUser().then(({ data, error }) => {
    // destructure the user from the data
    const { user } = data;
    // handle the error
    if (error) {
      throw new Error(error.message);
    }
    // check if the user is authenticated
    if (!user) {
      throw new Error(
        "Unable to get the current user; verify the user is authenticated and try again.",
      );
    }
    return user;
  });
  // return the current user
  return currentUser;
};

/**
 * A server-side function to get the username of the current user by invoking the `public.username` function on the database using
 * the rpc capabilities of the supabase client.
 * @throws {Error} If the user is not authenticated or if there is an error fetching the username.
 * @returns {string} The username of the current user.
 */
export const getUsername = async (
  options?: { client: SupabaseClient },
): Promise<string> => {
  // use or initialize a server-side supabase client
  const supabase = options?.client || (await createServerClient());
  // invoke the `username` RPC function to get the username
  const { data, error } = await supabase.rpc("username");
  // handle the error
  if (error) {
    throw new Error(
      error.message || "Error fetching the username.",
    );
  }
  // handle the case where the username is not found
  if (!data || data?.trim() === "") {
    throw new Error("Username not found for the current user.");
  }
  // return the username
  return data;
};
