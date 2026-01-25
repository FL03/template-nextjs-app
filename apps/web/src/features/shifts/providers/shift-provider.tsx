/**
 * Created At: 2025.10.29:21:06:55
 * @author - @FL03
 * @directory - src/features/shifts/providers
 * @file - shift-provider.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useShift } from "@/hooks/use-shift";
import { useUsername } from "@/hooks/use-username";

interface ShiftContext extends ReturnType<typeof useShift> {
  //
}

const ShiftContext = React.createContext<ShiftContext | null>(null);

/** Access the current context of the `WorkShiftProvider` */
export const useWorkShift = () => {
  const context = React.useContext(ShiftContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const WorkShiftProvider: React.FC<
  React.PropsWithChildren<{ shiftId?: string; username?: string }>
> = ({ children, shiftId, username }) => {
  const currentUsername = useUsername();
  username ??= currentUsername.username;
  // use the hook as the backend for the provider
  const { ...shifts } = useShift({ shiftId, username });

  const ctx = React.useMemo(
    () => ({
      ...shifts,
    }),
    [shifts],
  );
  // return the provider
  return <ShiftContext value={ctx}>{children}</ShiftContext>;
};
WorkShiftProvider.displayName = "WorkShiftProvider";
