/**
 * Created At: 2025.07.15:08:47:20
 * @author - @FL03
 * @file - toolbar-provider.tsx
 */
"use client";
// imports
import * as React from "react";

type ToolbarContext = {
  centerTitle: boolean;
};

const ToolbarContext = React.createContext<ToolbarContext>({
  centerTitle: false,
});

/** The `useToolbar` creates a new context for its children to share common access with */
export const useToolbar = () => {
  const ctx = React.useContext(ToolbarContext);
  if (!ctx) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return ctx;
};

export const ToolbarProvider: React.FC<
  React.PropsWithChildren<{
    centerTitle?: boolean;
  }>
> = (
  { children, centerTitle: centerTitleProp, ...props },
) => {
  // setup the stateful variables
  const [centerTitle] = React.useState<boolean>(() => centerTitleProp ?? false);
  // memoize the context to avoid unnecessary re-renders
  const ctx = React.useMemo(() => ({ centerTitle }), [centerTitle]);
  // render the component
  return (
    <ToolbarContext.Provider value={ctx}>
      {children}
    </ToolbarContext.Provider>
  );
};
ToolbarProvider.displayName = "ToolbarProvider";

export default ToolbarProvider;
