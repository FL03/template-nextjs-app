/**
 * Created At: 2025.11.08:13:29:07
 * @author - @FL03
 * @directory - src/features/notifications/widgets
 * @file - notification-menus.tsx
 */
"use client";
import * as React from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { useNotifications } from "../../provider";
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

export const NotificationsContextMenu: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof ContextMenu>, "children"> & {
    classNames?: ClassNames<"content" | "icon" | "label" | "trigger">;
    triggerSize?: React.ComponentProps<typeof Button>["size"];
    triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  }
> = (
  {
    classNames,
    triggerSize = "icon",
    triggerVariant = "outline",
    ...props
  },
) => {
  const { markAsRead } = useNotifications();
  return (
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
          <ContextMenuLabel className="sr-only">Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={(event) => {
              // clean the event
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            Mark all as Read
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const NotificationsDropdownMenu: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu>, "children"> & {
    classNames?: ClassNames<"content" | "icon" | "label" | "trigger">;
    alignContent?: React.ComponentProps<typeof DropdownMenuContent>["align"];
    contentSide?: React.ComponentProps<typeof DropdownMenuContent>["side"];
    triggerSize?: React.ComponentProps<typeof Button>["size"];
    triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  }
> = (
  {
    classNames,
    alignContent = "end",
    contentSide = "left",
    triggerSize = "icon",
    triggerVariant = "outline",
    ...props
  },
) => {
  const {} = useNotifications();
  return (
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
          <DropdownMenuLabel className="sr-only">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(event) => {
              // clean the event
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <span>
              Mark all as Read
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
