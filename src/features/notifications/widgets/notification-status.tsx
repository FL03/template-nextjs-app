/**
 * Created At: 2025.11.09:11:17:48
 * @author - @FL03
 * @directory - src/features/notifications/widgets
 * @file - notification-status.tsx
 */
"use client";
import * as React from "react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components
import { Badge } from "@/components/ui/badge";

type NotificationStatus = string | "unread" | "read" | "archived";
type StatusColorMap = Record<NotificationStatus, string>;

const COLORWAYS: StatusColorMap = {
  unread: "bg-blue-500",
  read: "bg-gray-400",
  archived: "bg-yellow-500",
};

export const NotificationStatusIndicator: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {
    status?: NotificationStatus;
  }
> = ({ ref, className, status = "unread", ...props }) => {
  return (
    <div
      ref={ref}
      className={cn(
        "size-3 rounded-full",
        COLORWAYS[status] || COLORWAYS["unread"],
        className,
      )}
      {...props}
    />
  );
};

export const NotificationStatusBadge: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Badge>, "children"> & {
    classNames?: ClassNames<"label" | "indicator">;
    status?: NotificationStatus;
    hideLabel?: boolean;
  }
> = (
  { ref, className, classNames, hideLabel, status = "unread", ...props },
) => {
  const statusText = status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase();
  return (
    <Badge
      ref={ref}
      className={cn(
        "p-2 text-sm font-normal",
        className,
      )}
      {...props}
    >
      <NotificationStatusIndicator
        className={classNames?.indicatorClassName}
        status={status}
      />
      <span
        className={cn(
          hideLabel ? "sr-only" : "not-sr-only",
          classNames?.labelClassName,
        )}
      >
        {statusText}
      </span>
    </Badge>
  );
};
