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
// import { useModal } from "@/hooks/use-modal";

interface DashboardState {
}

type DashboardContext = {
  error: Error | null;
  isMobile: boolean;
  fullWidth: boolean;
  state: DashboardState;
  setFullWidth: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardContext = React.createContext<DashboardContext | null>(null);

/**
 * The `useDashboard` hook provides access to the current dashboard context, which includes information about the current flavor and whether the device is mobile.
 * @returns {DashboardContext} The current dashboard context.
 * @throws {Error} If the hook is used outside of a `DashboardProvider`.
 */
export function useDashboard(): DashboardContext {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) {
    throw new Error(
      "The `useDashboard` hook must be used within the bounds of a `DashboardProvider`.",
    );
  }
  return ctx;
}

// DashboardProvider
export const DashboardProvider: React.FC<
  React.PropsWithChildren<{
    fullWidth?: boolean;
  }>
> = ({ children, fullWidth: fullWidthProp }) => {
  const [_error, _setError] = React.useState<Error | null>(null);
  // setup the fullWidth state
  const [fullWidth, setFullWidth] = React.useState<boolean>(
    Boolean(fullWidthProp),
  );
  // check if the current device is mobile
  const isMobile = useIsMobile();
  const _state = React.useMemo<DashboardState>(
    () => ({}),
    [],
  );

  const ctx = React.useMemo<DashboardContext>(
    () => ({
      error: _error,
      state: _state,
      isMobile,
      fullWidth,
      setFullWidth,
    }),
    [
      _error,
      _state,
      isMobile,
      fullWidth,
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
