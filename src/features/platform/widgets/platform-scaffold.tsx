/**
 * Created At: 2025.07.14:10:59:12
 * @author - @FL03
 * @file - platform-scaffold.tsx
 */
"use client";
// imports
import * as React from "react";
// feature-specific
// hooks
import { useAuth } from "@/hooks/use-auth";
// components
import { AppBarProvider } from "@/components/common/appbar";
import {
  Scaffold,
  ScaffoldContent,
  ScaffoldNav,
  ScaffoldProvider,
} from "@/components/common/scaffold";
import { ToolbarProvider } from "@/components/common/toolbar";
import { SidebarProvider } from "@/components/ui/sidebar";
// local
import { PlatformAppBar } from "./platform-appbar";
import { PlatformSidebar } from "./sidebar";
import { PlatformToolbar } from "./platform-toolbar";

type ScaffoldWithSidebarProps = {
  fullWidth?: boolean;
  openSidebarByDefault?: boolean;
  collapsible?: "offcanvas" | "icon" | "none";
  sidebarPosition?: "left" | "right";
  sidebarVariant?: "sidebar" | "floating" | "inset";
};

/**
 * This component extends the base scaffold with a sidebar that is only available to authenticated users.
 */
export const PlatformScaffold: React.FC<
  & Omit<React.ComponentPropsWithRef<typeof Scaffold>, "asChild">
  & ScaffoldWithSidebarProps
> = ({
  ref,
  children,
  fullWidth,
  openSidebarByDefault = false,
  collapsible = "offcanvas",
  sidebarPosition = "right",
  sidebarVariant = "inset",
  ...props
}) => {
  // use the auth hook to determine if the user is authenticated
  const { state: { isAuthenticated } } = useAuth();
  // render the scaffold with the app bar and sidebar
  return (
    <ScaffoldProvider>
      <AppBarProvider>
        <ToolbarProvider>
          <SidebarProvider
            defaultOpen={openSidebarByDefault}
            className="flex-1 min-h-full w-full"
          >
            {/* screen */}
            <Scaffold {...props} ref={ref}>
              {/* appbar */}
              <ScaffoldNav asChild className="relative sticky top-0 z-10">
                <PlatformAppBar />
              </ScaffoldNav>
              {/* display */}
              <ScaffoldContent fullWidth={fullWidth}>
                {children}
              </ScaffoldContent>
              <PlatformToolbar flavor="accent" />
            </Scaffold>
            {isAuthenticated && (
              <PlatformSidebar
                collapsible={collapsible}
                side={sidebarPosition}
                variant={sidebarVariant}
              />
            )}
          </SidebarProvider>
        </ToolbarProvider>
      </AppBarProvider>
    </ScaffoldProvider>
  );
};
PlatformScaffold.displayName = "PlatformScaffold";

export default PlatformScaffold;
