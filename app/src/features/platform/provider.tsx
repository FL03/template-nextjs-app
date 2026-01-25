/**
 * Created At: 2025.09.15:05:17:07
 * @author - @FL03
 * @directory - src/features/platform/provider
 * @file - platform-provider.tsx
 */
"use client";
// imports
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// project
import { CurrentUserProvider } from "@/features/auth";
import { ThemeProvider } from "next-themes";

/** The root provider for the platform  */
export const PlatformProvider: React.FC<
  React.PropsWithChildren<{
    defaultTheme?: string;
    queryClient?: QueryClient;
  }>
> = ({
  children,
  defaultTheme = "system",
  queryClient: queryClientProp = new QueryClient(),
}) => {
  // Use the provided queryClient or create one per provider instance
  const [queryClient] = React.useState(
    () => queryClientProp,
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
        <CurrentUserProvider>
          {children}
        </CurrentUserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
PlatformProvider.displayName = "PlatformProvider";

export default PlatformProvider;
