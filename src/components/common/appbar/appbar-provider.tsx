/**
 * Created At: 2025.07.15:08:51:43
 * @author - @FL03
 * @file - appbar-provider.tsx
 */
"use client";
// imports
import * as React from "react";

type AppbarContext = {
  centerTitle: boolean;
};

const AppbarContext = React.createContext<AppbarContext | null>(null);

export const useAppbar = (): AppbarContext => {
  const context = React.useContext(AppbarContext);
  if (!context) {
    throw new Error("`useAppbar` must be used within an `AppbarProvider`.");
  }
  return context;
};

// AppbarProvider
export const AppBarProvider: React.FC<
  React.PropsWithChildren<{ centerTitle?: boolean }>
> = ({
  children,
  centerTitle: centerTitleProp,
}) => {
  // setup the centerTitle state
  const [centerTitle] = React.useState(centerTitleProp ?? false);
  // memoize the context to avoid unnecessary re-renders
  const ctx = React.useMemo(
    () => ({ centerTitle }),
    [centerTitle],
  );
  // render the appbar as a context provider to allow for nested appbars
  return (
    <AppbarContext.Provider value={ctx}>
      {children}
    </AppbarContext.Provider>
  );
};
AppBarProvider.displayName = "AppbarProvider";
