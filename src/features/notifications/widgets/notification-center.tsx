/**
 * Created At: 2025.07.25:08:45:32
 * @author - @FL03
 * @file - notification-center.tsx
 */
"use client";
//imports
import * as React from "react";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { NotificationList } from "./notification-list";
import { useNotifications } from "../provider";
// components
import { RefreshButton } from "@/components/common/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const NotificationCenter: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    username?: string;
    classNames?: ClassNames<
      "action" | "content" | "header" | "footer" | "title" | "description"
    >;
  }
> = ({
  ref,
  className,
  classNames,
  description = "Manage all your notifications in one place",
  title = "Notifications",
  ...props
}) => {
  // use the hook to get notifications
  const { data, state, ...notifications } = useNotifications();
  // render the component
  return (
    <Card
      {...props}
      ref={ref}
      className={cn(
        "flex flex-1 flex-col h-full w-full relative z-auto",
        className,
      )}
    >
      <CardHeader
        className={cn("order-first w-full", classNames?.headerClassName)}
      >
        {title && (
          <CardTitle className={cn("text-lg", classNames?.titleClassName)}>
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className={cn(classNames?.descriptionClassName)}>
            {description}
          </CardDescription>
        )}
        <CardAction className={classNames?.actionClassName}>
          <ButtonGroup>
            <RefreshButton
              isRefreshing={state.isReloading}
              onRefresh={() => {
                toast.promise(
                  notifications.reload,
                  {
                    loading: "Refreshing notifications...",
                    success: "Notifications refreshed successfully",
                    error: (error) =>
                      `Failed to refresh notifications: ${error.message}`,
                  },
                );
              }}
            />
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent
        className={cn("flex-1 h-full w-full", classNames?.contentClassName)}
      >
        <NotificationList items={data} />
      </CardContent>
      <CardFooter hidden className={cn("w-full", classNames?.footerClassName)}>
      </CardFooter>
    </Card>
  );
};
NotificationCenter.displayName = "NotificationCenter";

export default NotificationCenter;
