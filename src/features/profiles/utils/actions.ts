/**
 * Created At: 2025.11.02:09:45:48
 * @author - @FL03
 * @directory - src/features/profiles/utils
 * @file - actions.ts
 */
"use server";
// imports
import type { ActionStateData } from "@pzzld/actions";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";
// types
import type { ProfileData } from "../types";

/** A server action for updating the user profile */
export async function updateProfileAction(
  formState: ActionStateData,
  formData: FormData,
): Promise<ActionStateData> {
  const supabase = await createServerClient();
  const { id, ...payload } = Object.fromEntries(formData.entries()) as Partial<
    ProfileData
  >;
  if (!id) {
    const error = new Error("No user ID provided to update the profile...");
    logger.error(error, error.message);
    throw error;
  }
  const { data, error } = await supabase.from("profiles").update({
    ...payload,
  }).eq("id", id).select().single();

  if (error) {
    logger.error(error, error.message);
    // return the form state with the error
    return Object.assign(formState, { message: error.message, status: "error" });
  }
  return Object.assign(formState, { data, status: "success" });
}