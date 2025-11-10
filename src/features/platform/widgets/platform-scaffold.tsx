/**
 * Created At: 2025.07.14:10:59:12
 * @author - @FL03
 * @file - platform-scaffold.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useCurrentUser } from "@/features/auth";
import { cn } from "@/lib/utils";
// components
import {
  Scaffold,
  ScaffoldContent,
  ScaffoldNav,
} from "@/components/common/scaffold";
import { SidebarProvider } from "@/components/ui/sidebar";
// local
import { PlatformAppBar } from "./platform-appbar";
import { PlatformSidebar } from "./platform-sidebar";

/**
 * This component extends the base scaffold with a sidebar that is only available to authenticated users.
 */
export const PlatformScaffold: React.FC<
  & Omit<React.ComponentPropsWithoutRef<typeof Scaffold>, "asChild">
  & {
    compact?: boolean;
    openSidebarByDefault?: boolean;
    sidebarMode?: "offcanvas" | "icon" | "none";
    sidebarPosition?: "left" | "right";
    sidebarVariant?: "sidebar" | "floating" | "inset";
  }
> = ({
  children,
  className,
  compact,
  openSidebarByDefault = false,
  sidebarMode = "offcanvas",
  sidebarPosition = "right",
  sidebarVariant = "inset",
  ...props
}) => {
  // context
  const { authState: { isAuthenticated } } = useCurrentUser();
  // render
  return (
    <SidebarProvider defaultOpen={openSidebarByDefault}>
      <Scaffold className={cn("min-h-full", className)} {...props}>
        <ScaffoldNav asChild>
          <PlatformAppBar />
        </ScaffoldNav>
        <ScaffoldContent compact={compact}>
          {children}
        </ScaffoldContent>
      </Scaffold>
      {isAuthenticated && (
        <PlatformSidebar
          collapsible={sidebarMode}
          side={sidebarPosition}
          variant={sidebarVariant}
        />
      )}
    </SidebarProvider>
  );
};
PlatformScaffold.displayName = "PlatformScaffold";

export default PlatformScaffold;
