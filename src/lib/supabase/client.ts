/**
 * Created At: 2025-04-04:14:45:38
 * @author - @FL03
 * @description - client-side functions for supabase
 * @file - client.ts
 */
"use client";
// imports
import * as ssr from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
// project
import { PublicDatabase } from "@/types/database.types";
// feature-specific
import { supabaseCreds } from "./helpers";

export type SupabaseBrowserClientProps<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
> = ReturnType<typeof createBrowserClient<Database, SchemaName>>;

/**
 * @param schema - the schema to use for the database connection, defaults to 'public'
 * @returns {SupabaseClient} a new instance of the supabase client for use in the browser
 */
export const createBrowserClient = <
  Db = PublicDatabase,
  SchemaId extends string & keyof Db = "public" extends keyof Db ? "public"
    : string & keyof Db,
>(
  schema?: SchemaId,
): SupabaseClient<Db, SchemaId> => {
  const { url, anonKey } = supabaseCreds();

  return ssr.createBrowserClient<Db, SchemaId>(url, anonKey, {
    db: { schema },
  });
};

export default createBrowserClient;
