/**
 * Created At: 2025.07.06:07:02:17
 * @author - @FL03
 * @file - scaffold-provider.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useIsMobile } from "@/hooks/use-mobile";

type ScaffoldContext = {
  isMobile: boolean;
};

const ScaffoldContext = React.createContext<ScaffoldContext | null>(null);

/** Access the shared context for the scaffold injected by the corresponding provider. */
export const useScaffold = () => {
  const ctx = React.useContext(ScaffoldContext);
  if (!ctx) {
    throw new Error(
      "`useScaffold` must be used within the bounds of a `ScaffoldProvider`",
    );
  }
  return ctx;
};

// ScaffoldProvider
export const ScaffoldProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  // use the isMobile hook to determine if the device is mobile
  const isMobile = useIsMobile();
  // declare the memoized values for the scaffold provider
  const ctx = React.useMemo(() => ({ isMobile }), [isMobile]);
  return (
    <ScaffoldContext.Provider value={ctx}>
      {children}
    </ScaffoldContext.Provider>
  );
};
ScaffoldProvider.displayName = "ScaffoldProvider";

export default ScaffoldProvider;
