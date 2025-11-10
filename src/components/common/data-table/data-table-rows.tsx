/**
 * Created At: 2025.09.20:21:37:04
 * @author - @FL03
 * @directory - src/components/common/data-table/rows
 * @file - total-row.tsx
 */
"use client";
// imports
import * as React from "react";
import ReactTable, { RowData } from "@tanstack/react-table";
// project
import { cn } from "@/lib/utils";
// local
import { DataTableCell, useDataTable } from "./data-table";
import { summaryFn } from "./utils";
// components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { TableRow } from "@/components/ui/table";

export const EmptyTableRow: React.FC<
  Omit<React.ComponentPropsWithRef<typeof TableRow>, "children"> & {
    colSpan?: number;
    message?: string;
  }
> = ({ colSpan = 1, message = "Nothing here!", ...props }) => (
  <TableRow {...props}>
    <DataTableCell colSpan={colSpan} className="h-[1/12] text-center">
      <span>{message}</span>
    </DataTableCell>
  </TableRow>
);

function TotalRowSelect<
  TData extends RowData,
  TValue = unknown,
>({
  column,
  dataFormat = "currency",
  ...props
}: React.ComponentProps<typeof Select> & {
  column: ReactTable.Column<TData, TValue>;
  dataFormat?: "number" | "currency" | "percent";
}) {
  // context
  const { table } = useDataTable();
  // define the selected state
  const [selected, setSelected] = React.useState<string>("count");

  const DisplayValue = (
    { value, placeholder = "-" }: {
      value?: number | null;
      placeholder?: string;
    } = {},
  ) => {
    const formatValueAs = (
      value?: number | null,
      { mode, placeholder = "-" }: {
        mode?: string;
        placeholder?: string;
      } = {},
    ) => {
      if (!value || value === null || isNaN(value)) {
        return placeholder;
      }
      if (["count", "unique"].includes(selected)) {
        return new Intl.NumberFormat("en-us", {
          maximumFractionDigits: 0,
        }).format(value);
      }
      if (mode === "currency") {
        return new Intl.NumberFormat("en-us", {
          style: "currency",
          currency: "usd",
          maximumFractionDigits: 2,
        }).format(value);
      } else if (mode === "percent") {
        return new Intl.NumberFormat("en-us", {
          style: "percent",
          maximumFractionDigits: 2,
        }).format(value);
      } else {
        return new Intl.NumberFormat("en-us", {
          maximumFractionDigits: 2,
        }).format(value);
      }
    };
    return (
      <div className={cn("flex flex-nowrap items-center gap-2 truncate")}>
        <span>{formatValueAs(value, { mode: dataFormat, placeholder })}</span>
        <span className="text-xs text-muted-foreground">{selected}</span>
      </div>
    );
  };

  return (
    <Select onValueChange={setSelected} value={selected} {...props}>
      <SelectTrigger>
        <DisplayValue
          value={summaryFn(selected)(column.id, table.getCoreRowModel().rows)}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="count">Count</SelectItem>
        <SelectItem value="unique">Unique</SelectItem>
        <SelectSeparator />
        <SelectGroup title="stats">
          <SelectLabel>Statistics</SelectLabel>
          <SelectItem value="avg">Average</SelectItem>
          <SelectItem value="min">Min</SelectItem>
          <SelectItem value="max">Max</SelectItem>
          <SelectItem value="std">Standard Deviation</SelectItem>
          <SelectItem value="sum">Sum</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const TotalRowCell: React.FC<
  React.ComponentProps<typeof DataTableCell>
> = ({
  className,
  colSpan = 1,
  ...props
}) => (
  <DataTableCell
    className={cn(
      "inline-flex flex-1 items-center justify-center",
      "font-semibold ",
      "transition-colors whitespace-nowrap",
      "hover:cursor-pointer focus:ring focus:ring-ring",
      className,
    )}
    colSpan={colSpan}
    {...props}
  />
);

export const TotalRow: React.FC<React.ComponentProps<typeof TableRow>> = ({
  className,
  ...props
}) => {
  const { table } = useDataTable();

  const columns = table.getAllColumns();
  const dataCols = columns.filter((column) => column.id.startsWith("tips_c"));
  const dateCol = columns.find((column) => column.id === "date");
  const totalTipsCol = columns.find((column) => column.id === "total_tips");
  const totalRows = table.getCoreRowModel().rows.length;

  return (
    <TableRow
      className={cn("flex flex-1 flex-nowrap w-full", className)}
      {...props}
    >
      <DataTableCell
        className="inline-flex flex-1 px-2 items-center justify-center"
        colSpan={1}
      >
        <span className="font-semibold">Total</span>
      </DataTableCell>
      <TotalRowCell>
        <span>
          {dateCol?.getAggregationFn?.()?.(
            "date",
            [],
            table.getCoreRowModel().rows,
          )}
        </span>
      </TotalRowCell>
      {dataCols.map((column, index) => (
        <TotalRowCell key={index} colSpan={1}>
          <TotalRowSelect column={column} dataFormat="currency" />
        </TotalRowCell>
      ))}
      <TotalRowCell key={totalTipsCol?.id} colSpan={1}>
        <span>
          {new Intl.NumberFormat("en-us", {
            currency: "usd",
            maximumFractionDigits: 2,
          }).format(
            totalTipsCol?.getAggregationFn?.()?.(
              totalTipsCol?.id,
              [],
              table.getCoreRowModel().rows,
            ),
          )}
        </span>
        {/* <TotalRowSelect column={column} /> */}
      </TotalRowCell>
      <DataTableCell
        className="inline-flex flex-1 items-center justify-center gap-2"
        colSpan={1}
      >
        <span className="font-semibold">{totalRows}</span>
        <span className="text-muted-foreground">rows</span>
      </DataTableCell>
    </TableRow>
  );
};
TotalRow.displayName = "TotalRow";
