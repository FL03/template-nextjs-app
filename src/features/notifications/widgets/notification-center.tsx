/**
 * Created At: 2025.07.25:08:45:32
 * @author - @FL03
 * @file - notification-center.tsx
 */
"use client";
//imports
import * as React from "react";
import { toast } from "sonner";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// components
import { RefreshButton } from "@/components/common/button";
import { Description, Title } from "@/components/common/typography";
// local
import { NotificationList } from "./notification-list";
import { useNotifications } from "../provider";

export const NotificationCenter: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    username?: string;
  }
> = ({
  ref,
  className,
  description = "Manage all your notifications in one place",
  title = "Notifications",
  ...props
}) => {
  // use the hook to get notifications
  const { data, state, ...notifications } = useNotifications();
  // create a callback for refreshing the notifications
  const handleRefresh = async () => {
    // wrap the callback with a toast
    toast.promise(
      // refresh the notifications
      notifications.refresh,
      {
        loading: "Refreshing notifications...",
        success: "Notifications refreshed successfully",
        error: (error) => `Failed to refresh notifications: ${error.message}`,
      },
    );
  };
  // render the component
  return (
    <div
      {...props}
      ref={ref}
      className={cn("container mx-auto flex-1 h-full w-full", className)}
    >
      <div className="flex flex-nowrap items-center mb-3">
        <div className="inline-flex flex-col mr-auto">
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
        </div>
        <div className="inline-flex flex-nowrap items-center gap-2 ml-auto">
          <RefreshButton
            onRefresh={handleRefresh}
            isRefreshing={state.isRefreshing}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 lg:gap-4 h-full w-full">
        <NotificationList
          variant="card"
          items={data}
          onItemClick={async (item) => {
            if (!item.id) {
              logger.warn("Notification item does not have an ID");
              return;
            }
            if (item.status === "unread") {
              // mark the notification as read
              await notifications.markAsRead(item.id);
            } else {
              // unmark the notification as read
              await notifications.updateStatus(item.id, "unread");
            }
          }}
        />
      </div>
    </div>
  );
};
NotificationCenter.displayName = "NotificationCenter";

export default NotificationCenter;
