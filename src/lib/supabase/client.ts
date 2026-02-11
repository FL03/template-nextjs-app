/**
 * Created At: 2025-04-04:14:45:38
 * @author - @FL03
 * @description - client-side functions for supabase
 * @file - client.ts
 */
'use client';
// imports
import * as ssr from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
// project
import type { Database } from '@/types/database.types';
// local
import { supabaseCreds } from './helpers';
import type { SupabaseSchemaName } from './types';

/**
 * @param schema - the schema to use for the database connection, defaults to 'public'
 * @returns {SupabaseClient} a new instance of the supabase client for use in the browser
 */
export const createBrowserClient = <
  Db = Database,
  Schema extends SupabaseSchemaName<Db> = 'public' extends keyof Omit<
    Db,
    '__InternalSupabase'
  >
    ? 'public'
    : string & keyof Omit<Db, '__InternalSupabase'>,
>(
  schema?: Schema,
): SupabaseClient<Db, Schema> => {
  const { url, anonKey } = supabaseCreds();

  return ssr.createBrowserClient<Db, Schema>(url, anonKey, {
    db: { schema },
  });
};

export default createBrowserClient;
