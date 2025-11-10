/**
 * Created At: 2025.09.11:15:19:13
 * @author - @FL03
 * @file - database.ts
 */
import { Database } from "@/types/database.types/database.rms.types";

export type ShiftStatus = Database["rms"]["Enums"]["Shift Status"];

export type PayPeriodData = Database["rms"]["Tables"]["pay_periods"]["Row"];
export type PayPeriodInsert =
  Database["rms"]["Tables"]["pay_periods"]["Insert"];
export type PayPeriodUpdate =
  Database["rms"]["Tables"]["pay_periods"]["Update"];

export type ShiftData = Database["rms"]["Tables"]["shifts"]["Row"];
export type ShiftInsert = Database["rms"]["Tables"]["shifts"]["Insert"];
export type ShiftUpdate = Database["rms"]["Tables"]["shifts"]["Update"];

/** A type alias for an entry within the `rms.PayPeriods` table */
export type PayPeriod = PayPeriodData | PayPeriodInsert | PayPeriodUpdate;
/** A type alias for an entry within the `rms.shifts` table */
export type Shift = ShiftData | ShiftInsert | ShiftUpdate;
