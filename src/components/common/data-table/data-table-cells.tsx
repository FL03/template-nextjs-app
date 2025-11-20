/**
 * Created At: 2025.11.10:13:08:30
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-cells.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames } from "@pzzld/core";
import ReactTable, { RowData } from "@tanstack/react-table";
// project
import { cn } from "@/lib/utils";
// local
import { useDataTable } from "./data-table-provider";
import { summaryFn } from "./utils";
// components
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";

export const DataTableCell: React.FC<
  React.ComponentPropsWithRef<typeof TableCell>
> = ({
  ref,
  className,
  ...props
}) => (
  <TableCell
    ref={ref}
    data-slot="data-table-cell"
    className={cn(
      "flex flex-1 items-center justify-center min-w-30 w-full gap-1",
      className,
    )}
    {...props}
  />
);
DataTableCell.displayName = "DataTableCell";

export function DataTableSelectSummaryCell<
  TData extends RowData,
  TValue = unknown,
>({
  ref,
  className,
  classNames,
  column,
  contentPosition = "popper",
  locale = "en-us",
  formatOptions = {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 2,
  },
  defaultValue = "count",
  triggerSize = "sm",
  value: valueProp,
  onValueChange,
  ...props
}: React.ComponentPropsWithRef<typeof DataTableCell> & {
  classNames?: ClassNames<"content" | "display" | "trigger">;
  column: ReactTable.Column<TData, TValue>;
  locale?: Intl.LocalesArgument;
  formatOptions?: Intl.NumberFormatOptions;
  contentPosition?: React.ComponentProps<typeof SelectContent>["position"];
  triggerSize?: React.ComponentProps<typeof SelectTrigger>["size"];
  defaultValue?: string;
  value?: string;
  onValueChange?(value: string): void;
}) {
  // context
  const { table } = useDataTable();
  // define the selected state
  const [selected, setSelected] = React.useState<string>(defaultValue);

  const handleValueChange = React.useCallback((next: string) => {
    setSelected((prev) => {
      if (prev === next) return prev;
      onValueChange?.(next);
      return next;
    });
  }, [onValueChange]);

  // synchronize the internal and external values
  React.useEffect(() => {
    if (valueProp && valueProp !== selected) {
      setSelected(valueProp);
    }
  }, [selected, valueProp]);

  const Trigger = (
    { className, mode = defaultValue }: {
      className?: string;
      mode?: string;
    } = {},
  ) => {
    function formatValueAs(
      data: number,
    ) {
      if (mode.match(/^(count|unique)$/gmi)) {
        return new Intl.NumberFormat(locale, {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(data);
      }
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
        ...formatOptions,
      }).format(data);
    }

    const res = summaryFn(mode)(
      column.id,
      table.getCoreRowModel().rows,
    );

    return (
      <SelectTrigger
        id="data-table-summary-select-trigger"
        className={cn(
          "dark:bg-transparent border-none rounded-none shadow-none",
          className,
        )}
      >
        <span
          className={cn(
            "text-end font-mono font-semibold",
          )}
        >
          {res ? formatValueAs(res) : "-"}
        </span>
        <Label className="text-nowrap text-xs sr-only md:not-sr-only text-muted-foreground">
          {mode}
        </Label>
      </SelectTrigger>
    );
  };

  return (
    <DataTableCell ref={ref} className={cn("p-0", className)} {...props}>
      <Select onValueChange={handleValueChange} value={selected}>
        <Trigger
          className={classNames?.triggerClassName}
          mode={selected}
        />
        <SelectContent
          className={cn("", classNames?.contentClassName)}
          position={contentPosition}
        >
          <SelectItem value="count">Count</SelectItem>
          <SelectItem value="unique">Unique</SelectItem>
          <SelectSeparator />
          <SelectGroup title="stats">
            <SelectLabel>Statistics</SelectLabel>
            <SelectItem value="avg">Avg</SelectItem>
            <SelectItem value="min">Min</SelectItem>
            <SelectItem value="max">Max</SelectItem>
            <SelectItem value="std">Std</SelectItem>
            <SelectItem value="sum">Sum</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </DataTableCell>
  );
}
