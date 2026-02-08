/**
 * Created At: 2025.10.18:01:56:00
 * @author - @FL03
 * @directory - src/features/platform/utils
 * @file - server.ts
 */
"use server";
// types
import type { ActionStateData } from "@pzzld/actions";

/** A server-side action for saving modifications to the platform settings. */
export async function savePlatformSettings(
  state: ActionStateData,
  data: FormData,
): Promise<ActionStateData> {
  state.status = "success";
  return state;
}
