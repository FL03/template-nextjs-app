/**
 * Created At: 2025.10.03:17:24:15
 * @author - @FL03
 * @directory - src/features/shifts/utils
 * @file - server.ts
 */
"use client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase";
import { DatabaseFilter } from "@/types/filter";
import { Database } from "@/types/database.types";
// local
import { ShiftData } from "../types";

export const streamShifts = (
  filter: DatabaseFilter<ShiftData>,
  onChanges?: (payload: RealtimePostgresChangesPayload<ShiftData>) => void,
) => {
  const supabase = createBrowserClient();
  return supabase
    .channel(`shifts:${filter.value}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "rms",
        table: "shifts",
        filter: filter.toString(),
      },
      (
        payload: RealtimePostgresChangesPayload<ShiftData>,
      ) => {
        const event = payload.eventType;
        logger.info(
          { event },
          `Received ${event} event on shifts table`,
        );
        onChanges?.(payload);
      },
    );
};

type StreamTableChangesProps = {
  onInsert?(data: ShiftData): void;
  onUpdate?(data: ShiftData): void;
  onDelete?(data: ShiftData): void;
};

/**
 * Create a channel for listening to changes in the shifts table.
 *
 * @param {string} username the username of the user
 * @param {StreamTableChangesProps} options optional callbacks for handling changes
 * @returns
 */
export const onShiftsChange = (
  filter: DatabaseFilter<keyof ShiftData>,
  options?: StreamTableChangesProps,
) => {
  const { onInsert, onUpdate, onDelete } = options ?? {};
  const supabase = createBrowserClient<Database, "rms">("rms");
  // define the subscription
  return supabase
    .channel(`shifts-${filter.key}:${filter.value}`, {
      config: { private: true },
    })
    .on(
      "postgres_changes",
      {
        event: "*",
        filter: filter.toString(),
        schema: "rms",
        table: "shifts",
      },
      (payload: RealtimePostgresChangesPayload<ShiftData>) => {
        logger.info("Processing changes to the shifts table");
        // make sure any new data is correctly formatted
        const newData = payload.new as ShiftData;
        // handle any new shifts
        if (payload.eventType === "INSERT") {
          logger.info("New shift detected");
          onInsert?.(newData);
        }
        // handle any updates made to a shift
        if (payload.eventType === "UPDATE") {
          logger.info("Shift updated");
          onUpdate?.(newData);
        }
        // remove any deleted shifts from the store
        if (payload.eventType === "DELETE") {
          logger.info("Shift deleted");
          onDelete?.(newData);
        }
      },
    );
};
