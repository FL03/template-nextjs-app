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
  isCompact: boolean;
  isMobile: boolean;
  fullWidth: boolean;
}

type DashboardContext = {
  state: DashboardState;
  error: Error | null;
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
    isCompact?: boolean;
    fullWidth?: boolean;
  }>
> = ({ children, isCompact: isCompactProp, fullWidth: fullWidthProp }) => {
  const [_error, _setError] = React.useState<Error | null>(null);
  // setup the fullWidth state
  const [compact] = React.useState<boolean>(Boolean(isCompactProp));
  const [fullWidth] = React.useState<boolean>(
    Boolean(fullWidthProp),
  );
  // check if the current device is mobile
  const isMobile = useIsMobile();

  const _state = React.useMemo<DashboardState>(() => ({
    isCompact: compact,
    isMobile,
    fullWidth,
  }), [compact, isMobile, fullWidth]);

  const ctx = React.useMemo<DashboardContext>(
    () => ({
      error: _error,
      state: _state,
    }),
    [
      _error,
      _state,
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
