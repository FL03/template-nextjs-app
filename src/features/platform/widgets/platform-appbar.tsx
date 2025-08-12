/**
 * Created At: 2025.07.09:14:04:58
 * @author - @FL03
 * @file - platform-appbar.tsx
 */
"use client";
// imports
import * as React from "react";
import Link from "next/link";
// project
import { cn } from "@/lib/utils";
// features
import { LoginButton } from "@/features/auth";
// hooks
import { useAuth } from "@/hooks/use-auth";
// components
import {
  AppBar,
  AppBarAction,
  AppBarActions,
  AppBarContent,
  AppBarLeading,
  AppBarTitle,
  AppBarTrailing,
} from "@/components/common/appbar";
import { PzzldLogo } from "@/components/common/icons";
import { ThemeButton } from "@/components/common/theme";
// local
import { PlatformNavbar } from "./platform-navbar";
import { UserProfileSidebarTrigger } from "./sidebar";

export const PlatformBanner: React.FC<
  Partial<React.ComponentPropsWithRef<typeof Link>>
> = ({ ref, className, href = "/", ...props }) => {
  return (
    <Link
      {...props}
      ref={ref}
      className={cn(
        "inline-flex items-center flex-nowrap gap-1 p-2",
        "cursor-pointer transition-opacity rounded-lg",
        "hover:bg-accent hover:text-accent-foreground hover:ring hover:ring-accent/10 hover:opacity-80",
        className,
      )}
      href={href}
    >
      <PzzldLogo className="h-6 w-6" />
      <AppBarTitle className="sr-only md:not-sr-only" textSize="lg">
        pzzld
      </AppBarTitle>
    </Link>
  );
};

/** The primary appbar used throughout the application  */
export const PlatformAppBar: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof AppBar>,
    "asChild" | "id" | "children"
  >
> = ({
  ref,
  className,
  ...props
}) => {
  // use the useAuth hook to get the current auth state
  const { state: { isAuthenticated } } = useAuth();
  // render the component
  return (
    <AppBar
      {...props}
      id="platform-appbar"
      ref={ref}
    >
      <AppBarLeading>
        <PlatformBanner href="/" />
      </AppBarLeading>
      <AppBarContent>
        <PlatformNavbar />
      </AppBarContent>
      <AppBarTrailing>
        <AppBarActions>
          <AppBarAction>
            <ThemeButton />
          </AppBarAction>
          <AppBarAction>
            {isAuthenticated
              ? <UserProfileSidebarTrigger />
              : <LoginButton variant="outline" />}
          </AppBarAction>
        </AppBarActions>
      </AppBarTrailing>
    </AppBar>
  );
};
PlatformAppBar.displayName = "PlatformAppBar";

export default PlatformAppBar;
