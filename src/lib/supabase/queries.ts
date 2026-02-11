/**
 * Created At: 2025.07.26:15:18:03
 * @author - @FL03
 * @file - queries.ts
 */
'use server';
// imports
import { SupabaseClient } from '@supabase/supabase-js';
// local
import { createServerClient } from './server';

/**
 * A server-side function to get the username of the current user by invoking the `public.username` function on the database using
 * the rpc capabilities of the supabase client.
 * @throws {Error} If the user is not authenticated or if there is an error fetching the username.
 * @returns {string} The username of the current user.
 */
export const getUsername = async (options?: {
  client: SupabaseClient;
}): Promise<string> => {
  // use or initialize a server-side supabase client
  const supabase = options?.client || (await createServerClient());
  // invoke the `username` RPC function to get the username
  const { data, error } = await supabase.rpc('username');
  // handle the error
  if (error) {
    throw new Error(error.message || 'Error fetching the username.');
  }
  // handle the case where the username is not found
  if (!data || data?.trim() === '') {
    throw new Error('Username not found for the current user.');
  }
  // return the username
  return data;
};
