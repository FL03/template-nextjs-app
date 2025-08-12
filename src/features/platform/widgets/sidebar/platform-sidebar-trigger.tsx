/**
 * Created At: 2025.07.13:10:53:47
 * @author - @FL03
 * @file - platform-sidebar-trigger.tsx
 */
"use client";
// imports
import * as React from "react";
import { UserRoundIcon, UserRoundMinusIcon } from "lucide-react";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

/** A custom sidebar trigger for the platform with additional controls */
export const UserProfileSidebarTrigger: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, "children"> & {
    side?: "left" | "right";
    showLabel?: boolean;
  }
> = ({
  ref,
  className,
  showLabel,
  side = "left",
  size = "default",
  variant = "ghost",
  onClick,
  ...props
}) => {
  // use the sidebar context to get the current sidebar state
  const { open, openMobile, toggleSidebar, state } = useSidebar();

  const isOpen = open || openMobile || state === "expanded";
  const buttonSize = isOpen && showLabel ? size : "icon";

  const handleClick = (): React.MouseEventHandler<HTMLButtonElement> => {
    return (event) => {
      // prevent the sidebar from toggling the page scroll
      event.preventDefault();
      // toggle the sidebar
      toggleSidebar();
      // call the original onClick function, if it exists
      onClick?.(event);
    };
  };

  return (
    <Button
      {...props}
      autoFocus={false}
      ref={ref}
      className={cn(
        "items-center justify-center min-w-8",
        "hover:background-blur hover:text-accent-foreground/75",
        className,
      )}
      onClick={handleClick()}
      size={buttonSize}
      variant={variant}
    >
      {isOpen
        ? <UserRoundMinusIcon className="h-5 w-5" />
        : <UserRoundIcon className="h-5 w-5" />}
      {
        <span className={cn(isOpen && showLabel ? "not-sr-only" : "sr-only")}>
          {isOpen ? "Close" : "Open"}
        </span>
      }
    </Button>
  );
};
UserProfileSidebarTrigger.displayName = "UserProfileSidebarTrigger";
