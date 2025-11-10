/**
 * Created At: 2025.10.22:21:15:21
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - org-actions.tsx
 */
"use client";
// imports
import React from "react";
import { EditIcon, MoreHorizontalIcon, Trash2Icon, ViewIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// local
import { deleteOrganization } from "../../utils";
// components
import { IconButton } from "@/components/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const OrganizationDropdownMenu: React.FC<
  React.ComponentPropsWithoutRef<typeof DropdownMenu> & {
    itemId?: string;
    classNames?: ClassNames<"content" | "icon" | "label" | "trigger">;
    alignContent?: React.ComponentProps<typeof DropdownMenuContent>["align"];
    contentSide?: React.ComponentProps<typeof DropdownMenuContent>["side"];
    triggerSize?: React.ComponentProps<typeof IconButton>["size"];
    triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
  }
> = (
  {
    classNames,
    itemId,
    alignContent = "start",
    contentSide = "bottom",
    dir = "ltr",
    triggerSize = "icon",
    triggerVariant = "ghost",
    ...props
  },
) => (
  <DropdownMenu dir={dir} {...props}>
    <DropdownMenuTrigger asChild>
      <IconButton
        label="More"
        size={triggerSize}
        variant={triggerVariant}
        className={classNames?.triggerClassName}
        classNames={{ labelClassName: classNames?.labelClassName }}
      >
        <MoreHorizontalIcon
          className={cn("size-4", classNames?.iconClassName)}
        />
      </IconButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      className="w-64"
      align={alignContent}
      side={contentSide}
    >
      <DropdownMenuGroup>
        <DropdownMenuLabel>Navigate</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link
            className="hover:underline"
            href={{
              pathname: `/organizations/${itemId}`,
              query: { defaultMode: "edit" },
            }}
          >
            <EditIcon className="size-4" />
            <span>Edit</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="hover:underline"
            href={{
              pathname: `/organizations/${itemId}`,
              query: { defaultMode: "read" },
            }}
          >
            <ViewIcon className="size-4" />
            <span>View</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="sr-only">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!itemId) {
              return logger.error(
                "No organization ID passed to the delete button.",
              );
            }
            // wrap the callback with a toast
            return toast.promise(deleteOrganization(itemId), {
              loading: "Deleting the organization...",
              error: "Failed to delete the organization.",
              success: "Successfully removed the organization.",
            });
          }}
        >
          <Trash2Icon className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
