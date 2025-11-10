/**
 * Created At: 2025.11.08:10:22:21
 * @author - @FL03
 * @directory - src/features/orgs/widgets/actions
 * @file - org-context-menus.tsx
 */
"use client";
// imports
import * as React from "react";
import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// local
import { deleteOrganization } from "../../utils";
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const OrganizationContextMenu: React.FC<
  React.ComponentPropsWithRef<typeof ContextMenuTrigger> & {
    itemId?: string;
    classNames?: ClassNames<"content">;
  }
> = ({ ref, classNames, itemId, ...props }) => (
  <ContextMenu dir="ltr">
    <ContextMenuTrigger ref={ref} {...props} />
    <ContextMenuContent className={cn("w-64", classNames?.contentClassName)}>
      <ContextMenuGroup>
        <ContextMenuLabel>Navigate</ContextMenuLabel>
        <ContextMenuItem asChild>
          <Link
            className="hover:underline"
            href={{
              pathname: `/organizations/${itemId}`,
              query: { mode: "edit" },
            }}
          >
            <EditIcon className="size-4" />
            <span>Edit</span>
          </Link>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Link
            className="hover:underline"
            href={{
              pathname: `/organizations/${itemId}`,
              query: { mode: "read" },
            }}
          >
            <EyeIcon className="size-4" />
            <span>View</span>
          </Link>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuGroup>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!itemId) {
              logger.error("No organization ID passed to the delete button.");
            }
            // wrap the callback with a toast
            toast.promise(deleteOrganization(itemId), {
              loading: "Deleting the organization...",
              error: "Failed to delete the organization.",
              success: "Successfully removed the organization.",
            });
          }}
        >
          <Trash2Icon className="size-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
);
