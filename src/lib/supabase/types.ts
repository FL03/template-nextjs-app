/**
 * Created At: 2025.08.06:17:49:40
 * @author - @FL03
 * @file - core.ts
 */
import {
  REALTIME_SUBSCRIBE_STATES,
  SupabaseClient,
} from "@supabase/supabase-js";

export type RealtimeSupabaseHandler = (
  status: REALTIME_SUBSCRIBE_STATES,
  err?: Error,
) => void;

export type SupaClient<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
> =
  | SupabaseClient<Database, SchemaName>
  | Promise<SupabaseClient<Database, SchemaName>>;

export type SupabaseClientOptions<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
> = { schema?: SchemaName; ssr?: boolean };
