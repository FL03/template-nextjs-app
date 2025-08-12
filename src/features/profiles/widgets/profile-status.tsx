/**
 * Created At: 2025.07.22:19:47:22
 * @author - @FL03
 * @file - profile-status.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";

const ProfileStatusIndicator: React.FC<
  Omit<React.ComponentPropsWithRef<"span">, "children"> & {
    status?: string;
  }
> = ({ ref, className, status = "active", ...props }) => {
  // a callback for matching a particular status to a color
  const userStatusAsColor = (status?: string | null): string => {
    if (!status) return "bg-gray-500";
    if (["available", "active", "online"].includes(status)) {
      return "bg-lime-500 text-lime-500 border-lime-600";
    }
    if (["away", "idle"].includes(status)) {
      return "bg-amber-500";
    }
    if (["busy", "dnd"].includes(status)) {
      return "bg-red-500";
    }
    // default color
    return "bg-gray-500";
  };
  // render the status indicator with the color
  return (
    <span
      {...props}
      ref={ref}
      className={cn(
        "rounded-full h-3 w-3 object-cover hover:opacity-90 hover:animate-pulse",
        "border border-transparent transition-all duration-300 ease-in-out",
        userStatusAsColor(status),
        className,
      )}
    />
  );
};
ProfileStatusIndicator.displayName = "ProfileStatusIndicator";

export const ProfileStatusBadge: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {
    status?: string;
    showLabel?: boolean;
  }
> = ({ ref, className, showLabel, status = "active", ...props }) => {
  // render the badge with the status color
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "inline-flex flex-nowrap items-center gap-1 p-2",
        "bg-accent/75 border-accent/10 border border-transparent rounded-xl",
        "transition-all duration-300 ease-in-out hover:opacity-80 hover:ring hover:ring-accent/10",
        className,
      )}
    >
      <ProfileStatusIndicator status={status} />
      {status && (
        <span
          className={cn(
            "text-sm text-muted-foreground",
            showLabel ? "not-sr-only" : "sr-only",
          )}
        >
          {status}
        </span>
      )}
    </div>
  );
};
ProfileStatusBadge.displayName = "ProfileStatusBadge";
