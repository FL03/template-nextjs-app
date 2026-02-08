/**
 * Created At: 2025.11.10:13:58:52
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-rows.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames } from "@pzzld/core";
import ReactTable, { flexRender, RowData } from "@tanstack/react-table";
import { Edit2Icon, Trash2Icon } from "lucide-react";
// project
import { cn } from "@/lib/utils";
// local
import { DataTableCell } from "./data-table-cells";
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableRow } from "@/components/ui/table";

export function DataTableRow<TData extends RowData>({
  ref,
  className,
  onChange,
  row,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof TableRow>, "children"> & {
  onChange?: React.FormEventHandler;
  row?: ReactTable.Row<TData>;
}) {
  if (!row) return null;

  return (
    <TableRow
      ref={ref}
      className={cn(
        "flex items-center flex-nowrap w-full",
        className,
      )}
      data-slot="data-table-row"
      data-state={row?.getIsSelected() && "selected"}
      onClick={() => row?.toggleSelected()}
      {...props}
    >
      {row?.getVisibleCells().map((cell: any, index) => (
        <DataTableCell key={index} onChange={onChange}>
          {flexRender(
            cell.column.columnDef.cell,
            cell.getContext(),
          )}
        </DataTableCell>
      ))}
    </TableRow>
  );
}
DataTableRow.displayName = "DataTableRow";

export const DataTableEmptyRow: React.FC<
  Omit<React.ComponentPropsWithRef<typeof TableRow>, "children"> & {
    colSpan?: number;
    message?: React.ReactNode;
  }
> = ({ colSpan = 1, message = "Nothing here!", ...props }) => (
  <TableRow {...props}>
    <DataTableCell colSpan={colSpan} className="h-[1/12] text-center w-full">
      {message && <span>{message}</span>}
    </DataTableCell>
  </TableRow>
);

interface MenuProps<TData extends RowData>
  extends React.ComponentPropsWithRef<typeof ContextMenuTrigger> {
  dir?: "ltr" | "rtl";
  item?: TData;
  classNames?: ClassNames<"content" | "trigger" | "itemIcon" | "itemLabel">;
  onDelete?(data?: TData): void;
  onEdit?(data?: TData): void;
  onRefresh?(): void;
}

export function DataTableRowContextMenu<TData extends RowData = any>(
  {
    ref,
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
        ref={ref}
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
DataTableRowContextMenu.displayName = "DataTableRowContext";