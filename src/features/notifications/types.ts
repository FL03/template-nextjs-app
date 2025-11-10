/**
 * Created At: 2025-04-04:20:48:04
 * @author - @FL03
 * @description - types for notification related features
 * @file - types.ts
 */
import { Database } from "@/types/database.types";

export type NotificationData =
  Database["account"]["Tables"]["notifications"]["Row"];

export type NotificationInsert =
  Database["account"]["Tables"]["notifications"]["Insert"];

export type NotificationUpdate =
  Database["account"]["Tables"]["notifications"]["Update"];

  export type NotificationUpsert = Omit<Partial<NotificationData>, "id"> & {
    id: string;
  };

export type Notification =
  | NotificationData
  | NotificationInsert
  | NotificationUpdate;
