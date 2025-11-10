/**
 * Created At: 2025.11.02:10:22:54
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-info.tsx
 */
"use client";
// imports
import * as React from "react";
// local
import { useDataTable } from "../data-table";
// components
import { Label } from "@/components/ui/label";

export const DataTableSelectedRows: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Label>, "children"> & {
    compact?: boolean;
  }
> = ({ ref, compact, ...props }) => {
  const { table } = useDataTable();
  return (
    <Label ref={ref} {...props}>
      <span>
        Selected {table.getFilteredRowModel().rows.length}
      </span>
      {!compact && <span>out of {} items</span>}
    </Label>
  );
};

export const DataTableCurrentScope: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Label>, "children"> & {
    compact?: boolean;
  }
> = ({ ref, compact, ...props }) => {
  const { table } = useDataTable();
  return (
    <Label ref={ref} {...props}>
      <span>
        {table.getFilteredRowModel().rows.length}
      </span>
      {!compact && <span>Items</span>}
    </Label>
  );
};
