/**
 * Created At: 2025.11.08:13:29:07
 * @author - @FL03
 * @directory - src/features/notifications/widgets
 * @file - notification-menus.tsx
 */
"use client";
import * as React from "react";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { type NotificationData } from "../../types";
import { deleteNotification, updateNotification } from "../../utils";
// components
import { IconButton } from "@/components/common/button";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationItemContextMenu: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof ContextMenu>, "children"> & {
    classNames?: ClassNames<"content" | "icon" | "label" | "trigger">;
    value?: NotificationData | null;
    triggerSize?: React.ComponentProps<typeof Button>["size"];
    triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  }
> = (
  {
    classNames,
    value,
    triggerSize = "icon",
    triggerVariant = "outline",
    ...props
  },
) => (
  <ContextMenu {...props}>
    <ContextMenuTrigger asChild>
      <IconButton
        className={classNames?.triggerClassName}
        classNames={{ labelClassName: classNames?.labelClassName }}
      >
        <MoreHorizontalIcon
          className={cn("size-4", classNames?.iconClassName)}
        />
      </IconButton>
    </ContextMenuTrigger>
    <ContextMenuContent className={cn("", classNames?.contentClassName)}>
      <ContextMenuGroup>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem
          onClick={(event) => {
            // clean the event
            event.preventDefault();
            event.stopPropagation();
            // ensure an id exists
            if (!value?.id) {
              return toast.error("Notification ID is missing.");
            }
            toast.promise(
              updateNotification({
                id: value?.id,
                status: value?.status === "unread" ? "read" : "unread",
              }),
              {
                loading: "Marking as read...",
                success: "Notification marked as read!",
                error: "Failed to mark notification as read.",
              },
            );
          }}
        >
          <span>
            Mark as {value?.status === "unread" ? "Read" : "Unread"}
          </span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onClick={(event) => {
            // clean the event
            event.preventDefault();
            event.stopPropagation();
            // ensure an id exists
            if (!value?.id) {
              toast.error("Notification ID is missing.");
              return;
            }
            // delete
            toast.promise(deleteNotification(value?.id), {
              loading: "Deleting notification...",
              success: "Notification deleted!",
              error: "Failed to delete notification.",
            });
          }}
        >
          <Trash2Icon className="size-4" />
          <span>
            Delete
          </span>
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);

export const NotificationItemDropdownMenu: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu>, "children"> & {
    classNames?: ClassNames<"content" | "icon" | "label" | "trigger">;
    value?: NotificationData | null;
    alignContent?: React.ComponentProps<typeof DropdownMenuContent>["align"];
    contentSide?: React.ComponentProps<typeof DropdownMenuContent>["side"];
    triggerSize?: React.ComponentProps<typeof Button>["size"];
    triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  }
> = (
  {
    classNames,
    value,
    alignContent = "end",
    contentSide = "left",
    triggerSize = "icon",
    triggerVariant = "outline",
    ...props
  },
) => (
  <DropdownMenu {...props}>
    <DropdownMenuTrigger asChild>
      <IconButton
        className={classNames?.triggerClassName}
        classNames={{ labelClassName: classNames?.labelClassName }}
        size={triggerSize}
        variant={triggerVariant}
      >
        <MoreHorizontalIcon
          className={cn("size-4", classNames?.iconClassName)}
        />
      </IconButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align={alignContent}
      side={contentSide}
      className={cn("w-xs", classNames?.contentClassName)}
    >
      <DropdownMenuGroup>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={(event) => {
            // clean the event
            event.preventDefault();
            event.stopPropagation();
            // ensure an id exists
            if (!value?.id) {
              return toast.error("Notification ID is missing.");
            }
            // mark as read
            toast.promise(
              updateNotification({
                id: value?.id,
                status: value?.status === "unread" ? "read" : "unread",
              }),
              {
                loading: "Marking as read...",
                success: "Notification marked as read!",
                error: "Failed to mark notification as read.",
              },
            );
          }}
        >
          <span>
            Mark as {value?.status === "unread" ? "Read" : "Unread"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(event) => {
            // clean the event
            event.preventDefault();
            event.stopPropagation();
            // ensure an id exists
            if (!value?.id) {
              toast.error("Notification ID is missing.");
              return;
            }
            // delete
            toast.promise(deleteNotification(value?.id), {
              loading: "Deleting notification...",
              success: "Notification deleted!",
              error: "Failed to delete notification.",
            });
          }}
        >
          <Trash2Icon className="size-4" />
          <span>
            Delete
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
