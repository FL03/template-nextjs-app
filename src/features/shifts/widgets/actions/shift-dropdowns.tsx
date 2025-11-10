/**
 * Created At: 2025.10.29:22:26:31
 * @author - @FL03
 * @directory - src/features/shifts/widgets
 * @file - shift-actions.tsx
 */
"use client";
// imports
import * as React from "react";
import {
  CopyIcon,
  Edit2Icon,
  EyeIcon,
  FileBracesIcon,
  FileOutputIcon,
  FileSpreadsheetIcon,
  MoreHorizontalIcon,
  RotateCwIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { cn, downloadAsCSV, downloadAsJSON } from "@/lib/utils";
// local
import { useWorkSchedule } from "../../providers";
import { type ShiftData } from "../../types";
import { deleteShift } from "../../utils";
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

/** A custom `DropdownMenu` component with predefined actions targeting a particular shift, or item. */
export const ShiftDropdownMenu: React.FC<
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
    alignContent = "start",
    contentSide = "right",
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
        <DropdownMenuLabel>Navigate</DropdownMenuLabel>
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
          <span>
            Export
          </span>
          <FileOutputIcon />
        </DropdownMenuLabel>
        <DropdownMenuItem
          disabled={!item}
          onClick={() => {
            downloadAsJSON(item, `shift-${item?.id}.json`);
          }}
        >
          <span>Export JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!item}
          onClick={() => (
            downloadAsCSV(item ?? {}, `shift-${item?.id}.csv`)
          )}
        >
          <span>Export CSV</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="sr-only">Actions</DropdownMenuLabel>
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
          <FileOutputIcon className="size-4" />
          <span>Copy</span>
        </DropdownMenuItem>
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

/** A custom dropdown menu for the shift */
export const ShiftsDropdownMenu: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu>, "children"> & {
    classNames?: ClassNames<"icon" | "label" | "trigger">;
    alignContent?: React.ComponentProps<typeof DropdownMenuContent>["align"];
    contentSide?: React.ComponentProps<typeof DropdownMenuContent>["side"];
    triggerSize?: React.ComponentProps<typeof IconButton>["size"];
    triggerVariant?: React.ComponentProps<typeof IconButton>["variant"];
  }
> = (
  {
    classNames,
    alignContent = "start",
    contentSide = "right",
    triggerSize = "icon",
    triggerVariant = "outline",
    ...props
  },
) => {
  const { data, ...schedule } = useWorkSchedule();
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <IconButton
          label="More"
          size={triggerSize}
          variant={triggerVariant}
          className={classNames?.triggerClassName}
        >
          <MoreHorizontalIcon
            className={cn("size-4", classNames?.iconClassName)}
          />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={alignContent}
        side={contentSide}
        className="w-xs"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={!data}
            onClick={() => {
              toast.info("Preparing JSON export...", {
                id: "export-shifts-json",
                duration: 3000,
              });
              downloadAsJSON(data, "shifts-data.json");
            }}
          >
            <FileBracesIcon className="size-4" />
            <span>Export JSON</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!data}
            onClick={() => (
              downloadAsCSV(data, "shifts-data.csv")
            )}
          >
            <FileSpreadsheetIcon className="size-4" />
            <span>Export CSV</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(event) => {
              // cleanup the event
              event.preventDefault();
              event.stopPropagation();
              // copy shifts data
              toast.promise(
                navigator.clipboard.writeText(
                  JSON.stringify(data, undefined, 2),
                ),
                {
                  loading: "Copying shifts data to clipboard...",
                  success: "Shifts data copied to clipboard!",
                  error: "Failed to copy shifts data.",
                },
              );
            }}
          >
            <CopyIcon className="size-4" />
            <span>Copy</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={schedule.state.isReloading}
            onClick={schedule.reload}
          >
            <RotateCwIcon className="size-4" />
            <span>Reload Shifts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
