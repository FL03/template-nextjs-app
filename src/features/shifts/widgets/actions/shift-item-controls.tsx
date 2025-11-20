/**
 * Created At: 2025.11.09:20:13:06
 * @author - @FL03
 * @directory - src/features/shifts/widgets/actions
 * @file - shift-item-menus.tsx
 */
"use client";
// imports
import * as React from "react";
import {
  CopyIcon,
  Edit2Icon,
  EyeIcon,
  FileBracesIcon,
  FileSpreadsheetIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { cn, downloadAsCSV, downloadAsJSON } from "@/lib/utils";
// local
import { type ShiftData } from "../../types";
import { deleteShift } from "../../utils";
// components
import { IconButton } from "@/components/common/button";
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

export const ShiftItemContextMenu: React.FC<
  React.ComponentPropsWithoutRef<typeof ContextMenuTrigger> & {
    itemId?: string;
  }
> = ({ itemId, ...props }) => {
  return (
    <ContextMenu dir="ltr">
      <ContextMenuTrigger {...props} />
      <ContextMenuContent className="w-64">
        <ContextMenuGroup>
          <ContextMenuLabel>Navigate</ContextMenuLabel>
          <ContextMenuItem asChild>
            <Link
              href={{
                pathname: `/shifts/${itemId}`,
                query: { defaultMode: "update" },
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Edit2Icon className="size-4" />
              <span>Edit</span>
            </Link>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Link
              href={{
                pathname: `/shifts/${itemId}`,
                query: { defaultMode: "read" },
              }}
            >
              <EyeIcon className="size-4" />
              <span>View</span>
            </Link>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel className="sr-only">Actions</ContextMenuLabel>
          <ContextMenuItem
            variant="destructive"
            onClick={() => {
              deleteShift(itemId);
            }}
          >
            <Trash2Icon className="size-4" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};

/** A custom `DropdownMenu` component with predefined actions targeting a particular shift, or item. */
export const ShiftItemDropdownMenu: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu>, "children"> & {
    item?: ShiftData;
    classNames?: ClassNames<"icon" | "label" | "trigger" | "content">;
    alignContent?: React.ComponentProps<typeof DropdownMenuContent>["align"];
    contentSide?: React.ComponentProps<typeof DropdownMenuContent>["side"];
    triggerSize?: React.ComponentProps<typeof IconButton>["size"];
    triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
  }
> = (
  {
    classNames,
    item,
    alignContent = "end",
    contentSide = "bottom",
    triggerSize = "icon",
    triggerVariant = "ghost",
    ...props
  },
) => (
  <DropdownMenu {...props}>
    <DropdownMenuTrigger asChild>
      <IconButton
        label="More"
        className={classNames?.triggerClassName}
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
          onClick={() => {
            toast.promise(
              navigator.clipboard.writeText(
                JSON.stringify(item, undefined, 2),
              ),
              {
                loading: "Copying shifts data to clipboard...",
                success: "Shift data copied to clipboard!",
                error: "Failed to copy shift data.",
              },
            );
          }}
        >
          <CopyIcon className="size-4" />
          <span>Copy</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname: `/shifts/${item?.id}`,
              query: { defaultMode: "update" },
            }}
          >
            <Edit2Icon className="size-4" />
            <span>Edit</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={{
              pathname: `/shifts/${item?.id}`,
              query: { defaultMode: "read" },
            }}
          >
            <EyeIcon className="size-4" />
            <span>View</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuLabel>
          Export
        </DropdownMenuLabel>
        <DropdownMenuItem
          disabled={!item}
          onClick={() => {
            downloadAsJSON(item, `shift-${item?.id}.json`);
          }}
        >
          <FileBracesIcon className="size-4" />
          <span>Export JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!item}
          onClick={() => (
            downloadAsCSV(item ?? {}, `shift-${item?.id}.csv`)
          )}
        >
          <FileSpreadsheetIcon className="size-4" />
          <span>Export CSV</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="sr-only">More</DropdownMenuLabel>
        <DropdownMenuItem
          variant="destructive"
          onClick={async (event) => {
            // cleanup the event
            event.preventDefault();
            event.stopPropagation();
            // delete the shift
            toast.promise(deleteShift(item?.id), {
              loading: "Deleting shift...",
              success: "Shift deleted successfully.",
              error: "Failed to delete shift.",
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
