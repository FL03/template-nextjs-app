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
import ReactTable, { RowData } from "@tanstack/react-table";
import {
  AArrowDownIcon,
  AArrowUpIcon,
  ArrowUpDownIcon,
  EyeOffIcon,
  GroupIcon,
  PinIcon,
  PinOffIcon,
  UngroupIcon,
} from "lucide-react";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

interface ColumnHeaderProps<TData extends RowData, TValue = unknown>
  extends React.ComponentPropsWithRef<typeof Button> {
  column: ReactTable.Column<TData, TValue>;
  classNames?: ClassNames<"content" | "icon" | "label">;
}

export function DataTableColumnHeader<TData extends RowData, TValue = unknown>({
  ref,
  children,
  className,
  classNames,
  column,
  ...props
}: ColumnHeaderProps<TData, TValue>) {
  function TriggerIcon(
    { className, mode }: {
      className?: string;
      mode?: false | ReactTable.SortDirection;
    } = {},
  ) {
    switch (mode) {
      case "desc":
        return <AArrowDownIcon className={cn("size-4", className)} />;
      case "asc":
        return <AArrowUpIcon className={cn("size-4", className)} />;

      default:
        return <ArrowUpDownIcon className={cn("size-4", className)} />;
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={ref}
        id="data-table-column-header-trigger"
        className={cn(
          "flex flex-1 flex-nowrap items-center justify-center h-full w-full gap-2",
          "data-[state=open]:opacity-80 ",
          className,
        )}
        {...props}
      >
        <TriggerIcon
          className={classNames?.iconClassName}
          mode={column.getIsSorted()}
        />
        <Label
          htmlFor="data-table-column-header-trigger"
          className={cn(
            "font-semibold text-inherit text-nowrap leading-none tracking-tight",
            classNames?.labelClassName,
          )}
        >
          {children}
        </Label>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={classNames?.contentClassName}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Sort
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={!column.getCanSort()}
            onClick={() => column.toggleSorting(false)}
          >
            <AArrowDownIcon className="size-4" />
            <span>Ascending</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!column.getCanSort()}
            onClick={() => column.toggleSorting(true)}
          >
            <AArrowDownIcon className="size-4" />
            <span>Descending</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={!column.getCanGroup()}
            onClick={() => column.toggleGrouping()}
          >
            {column.getIsGrouped()
              ? <UngroupIcon className="size-4" />
              : <GroupIcon className="size-4" />}
            <span>
              {column.getIsGrouped() ? "Ungroup" : "Group"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!column.getCanPin()}
            onClick={() => column.pin(column.getIsPinned() ? false : "left")}
          >
            {column.getIsPinned()
              ? <PinOffIcon className="size-4" />
              : <PinIcon className="size-4" />}
            <span>
              {column.getIsPinned() ? "Unpin" : "Pin"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(false)}
            disabled={!column.getCanHide()}
          >
            <EyeOffIcon className="size-4" />
            <span>Hide</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
