/**
 * Created At: 2025.08.11:21:07:18
 * @author - @FL03
 * @file - platform/provider.tsx
 */
"use client";
// imports
import { ThemeProvider } from "next-themes";
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type ProviderProps = {
  defaultTheme?: string;
  queryClient?: QueryClient;
};

export const PlatformProvider: React.FC<PropsWithChildren<ProviderProps>> = ({
  children,
  defaultTheme = "system",
  queryClient: queryClientProp,
}) => {
  // Use the provided queryClient or create one per provider instance
  const [queryClient] = React.useState(
    () => queryClientProp ?? new QueryClient(),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        disableTransitionOnChange
        enableColorScheme
        enableSystem
        attribute="class"
        defaultTheme={defaultTheme}
        storageKey="theme"
        themes={["light", "dark"]}
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
PlatformProvider.displayName = "PlatformProvider";

export default PlatformProvider;
