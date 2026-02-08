/**
 * Created At: 2025.09.11:14:33:32
 * @author - @FL03
 * @file - supabase/types.ts
 */
import {
  AuthChangeEvent,
  REALTIME_SUBSCRIBE_STATES,
  Session,
} from "@supabase/supabase-js";

/** A compatible handler for the `.subscribe` method of the supabase api. */
export type SupabaseOnSubscribeHandler = (
  status: REALTIME_SUBSCRIBE_STATES,
  err?: Error,
) => void;

export type SupabaseOnAuthStateChangeHandler = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

/** A type alias defining the expected _type_ of `SchemaName` used to configure the browser and server clients. */
export type SupabaseSchemaName<Database = any> =
  & string
  & keyof Omit<Database, "__InternalSupabase">;

export type SupabaseClientOptions<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
> = { schema?: SchemaName; ssr?: boolean };



/** A type defining the format for callbacks */
type OnCallbackName<Name extends string> = `on${Capitalize<Lowercase<Name>>}`;

type OnCallbackMap<Name extends string> = {
  [K in OnCallbackName<Name>]?: Function;
};

export type SupabaseRealtimeCallbacks = OnCallbackMap<
  "insert" | "update" | "delete" | "all"
>;
