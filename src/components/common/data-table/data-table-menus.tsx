/**
 * Created At: 2025.11.02:11:05:52
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-columns.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames } from "@pzzld/core";
import { RowData } from "@tanstack/react-table";
import {
  Edit2Icon,
  Trash2Icon,
} from "lucide-react";
// project
import { cn } from "@/lib/utils";
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface MenuProps<TData extends RowData>
  extends React.ComponentPropsWithoutRef<typeof ContextMenuTrigger> {
  dir?: "ltr" | "rtl";
  item?: TData;
  classNames?: ClassNames<"content" | "trigger" | "itemIcon" | "itemLabel">;

  onDelete?(data?: TData): void;
  onEdit?(data?: TData): void;
  onRefresh?(): void;
}

export function DataTableRowContext<TData extends RowData = any>(
  {
    children,
    classNames,
    dir = "ltr",
    item,
    onDelete,
    onEdit,
    ...props
  }: MenuProps<TData>,
) {
  return (
    <ContextMenu dir={dir}>
      <ContextMenuTrigger
        asChild
        className={classNames?.triggerClassName}
        {...props}
      />
      <ContextMenuContent className={cn("w-64", classNames?.contentClassName)}>
        <ContextMenuGroup>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuItem
            className="gap-1"
            onClick={(event) => {
              // cleanup the event
              event.preventDefault();
              event.stopPropagation();
              // invoke the callback
              onEdit?.(item);
            }}
          >
            <Edit2Icon
              className={cn("size-4", classNames?.itemIconClassName)}
            />
            <span className={classNames?.itemLabelClassName}>Edit</span>
          </ContextMenuItem>
          <ContextMenuItem
            variant="destructive"
            onClick={(event) => {
              // cleanup the event
              event.preventDefault();
              event.stopPropagation();
              // invoke the callback
              onDelete?.(item);
            }}
          >
            <Trash2Icon
              className={cn("size-4", classNames?.itemIconClassName)}
            />
            <span className={classNames?.itemLabelClassName}>Delete</span>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
DataTableRowContext.displayName = "DataTableRowContext";