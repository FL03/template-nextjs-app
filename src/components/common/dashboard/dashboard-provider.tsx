/**
 * Created At: 2025.07.27:19:47:08
 * @author - @FL03
 * @file - dashboard-provider.tsx
 */
"use client";
// imports
import * as React from "react";
// hooks
import { useIsMobile } from "@/hooks/use-mobile";
import { useModal } from "@/hooks/use-modal";

type DashboardContext = {
  isCompact: boolean;
  isMobile: boolean;
  fullWidth: boolean;
  leading: ReturnType<typeof useModal>;
  trailing: ReturnType<typeof useModal>;
  setFullWidth: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardContext = React.createContext<DashboardContext | null>(null);

/**
 * The `useDashboard` hook provides access to the current dashboard context, which includes information about the current flavor and whether the device is mobile.
 * @returns {DashboardContext} The current dashboard context.
 * @throws {Error} If the hook is used outside of a `DashboardProvider`.
 */
export const useDashboard = (): DashboardContext => {
  // invoke the context
  const ctx = React.useContext(DashboardContext);
  // if the context is not defined, throw an error
  if (!ctx) {
    throw new Error(
      "useScaffold must be used within a `DashboardProvider`",
    );
  }
  // return the context
  return ctx;
};

// DashboardProvider
export const DashboardProvider: React.FC<
  React.PropsWithChildren<{
    compact?: boolean;
  }>
> = ({ children, compact }) => {
  // setup the fullWidth state
  const [fullWidth, setFullWidth] = React.useState<boolean>(!compact);
  // define states for tracking the presence of various components
  const [isCompact, setIsCompact] = React.useState<boolean>(false);
  // setup controllers for the panels
  const leading = useModal<HTMLDivElement>();
  const trailing = useModal<HTMLDivElement>();
  // check if the current device is mobile
  const isMobile = useIsMobile();
  // declare the memoized values for the scaffold provider
  const ctx = React.useMemo(
    () => ({
      fullWidth,
      isMobile,
      isCompact,
      leading,
      trailing,
      setFullWidth,
      setIsCompact,
    }),
    [
      fullWidth,
      isCompact,
      isMobile,
      leading,
      trailing,
      setFullWidth,
      setIsCompact,
    ],
  );
  // render provider
  return (
    <DashboardContext.Provider value={ctx}>
      {children}
    </DashboardContext.Provider>
  );
};
DashboardProvider.displayName = "DashboardProvider";

export default DashboardProvider;
