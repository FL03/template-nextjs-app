/**
 * Created At: 2025.11.04:14:07:17
 * @author - @FL03
 * @directory - src/features/shifts/widgets
 * @file - shift-context.tsx
 */
"use client";
// imports
import * as React from "react";
import Link from "next/link";
import { Edit2Icon, EyeIcon, Trash2Icon } from "lucide-react";
// project
import { downloadAsCSV, downloadAsJSON } from "@/lib/utils";
// local
import { useWorkSchedule } from "../../providers";
import { deleteShift } from "../../utils";
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

export const ShiftContextMenu: React.FC<
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

export const ShiftsContextMenu: React.FC<
  & React.ComponentPropsWithoutRef<typeof ContextMenuTrigger>
  & React.PropsWithChildren<{
    dir?: React.ComponentProps<typeof ContextMenu>["dir"];
  }>
> = ({ dir = "ltr", ...props }) => {
  const { data } = useWorkSchedule();
  return (
    <ContextMenu dir={dir}>
      <ContextMenuTrigger {...props} />
      <ContextMenuContent className="w-64">
        <ContextMenuGroup>
          <ContextMenuLabel>Export</ContextMenuLabel>
          <ContextMenuItem
            disabled={!data}
            onClick={() => {
              downloadAsJSON(data, "shifts-export.json");
            }}
          >
            Export JSON
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!data}
            onClick={() => {
              downloadAsCSV(data, "shifts-export.csv");
            }}
          >
            Export CSV
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel className="sr-only">Actions</ContextMenuLabel>
          <ContextMenuItem asChild>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
