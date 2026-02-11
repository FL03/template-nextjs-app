/**
 * Created At: 2025-04-04:20:43:26
 * @author - @FL03
 * @description - server-side functions for supabase
 * @file - server.ts
 */
'use server';
// imports
import { cookies } from 'next/headers';
import * as ssr from '@supabase/ssr';
// project
import type { Database } from '@/types/database.types';
// local
import { supabaseCreds } from './helpers';
import { type SupabaseSchemaName } from './types';

const serverClientCookies = async (): Promise<ssr.CookieMethodsServer> => {
  const jar = await cookies();
  return {
    getAll() {
      return jar.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          jar.set(name, value, options),
        );
      } catch {
        // The `setAll` method was called from a Server Component.
        // This can be ignored if you have middleware refreshing
        // user sessions.
      }
    },
  };
};

/**
 * Initialize a server-side supabase client.
 *
 * @param {Schema} schema - The schema to use for the database; defaults to `public`.
 */
export const createServerClient = async <
  Db = Database,
  Schema extends SupabaseSchemaName<Db> = 'public' extends keyof Omit<
    Db,
    '__InternalSupabase'
  >
    ? 'public'
    : string & keyof Omit<Db, '__InternalSupabase'>,
>(
  schema?: Schema,
) => {
  const { url, anonKey } = supabaseCreds();
  return ssr.createServerClient<Db, Schema>(url, anonKey, {
    cookies: await serverClientCookies(),
    db: { schema: schema },
  });
};

export default createServerClient;
