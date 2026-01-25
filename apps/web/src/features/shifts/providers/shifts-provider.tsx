/**
 * Created At: 2025.09.11:15:18:01
 * @author - @FL03
 * @file - shifts-provider.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useFilter } from "@/hooks/use-filter";
import { useShifts } from "@/hooks/use-shifts";
import { useUsername } from "@/hooks/use-username";
// types
import type { ShiftData } from "../types";

type ScheduleContext =
  & Omit<ReturnType<typeof useShifts>, "data">
  & ReturnType<typeof useFilter<ShiftData>>
  & {};

const ScheduleContext = React.createContext<ScheduleContext | null>(null);

/** Access the current context of the `ScheduleProvider` */
export const useWorkSchedule = () => {
  const context = React.useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const WorkScheduleProvider: React.FC<
  React.PropsWithChildren<{ username?: string }>
> = ({ children, username }) => {
  const currentUsername = useUsername();
  username ??= currentUsername.username;
  // use the hook as the backend for the provider
  const { data, ...shifts } = useShifts({ username });

  const filter = useFilter<ShiftData>({ values: data ?? [] });

  const ctx = React.useMemo(
    () => ({
      ...filter,
      ...shifts,
    }),
    [filter, shifts],
  );
  // return the provider
  return <ScheduleContext value={ctx}>{children}</ScheduleContext>;
};
WorkScheduleProvider.displayName = "ScheduleProvider";
