/**
 * Created At: 2025.11.01:13:52:11
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - parts.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames } from "@pzzld/core";
import ReactTable, {
  flexRender,
  RowData,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
// project
import { cn } from "@/lib/utils";
// local
import { EmptyTableRow, TotalRow } from "./data-table-rows";
// components
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableContext<TData extends RowData> = {
  options: TableOptions<TData>;
  table: ReactTable.Table<TData>;
};

const DataTableContext = React.createContext<DataTableContext<any> | null>(
  null,
);

/** The `useDataTable` hook provides access to the context injected by a `DataTableProvider`. */
export function useDataTable<TData extends RowData = any>(): DataTableContext<
  TData
> {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context;
}

export function DataTableProvider<TData>({
  children,
  options: optionsProp,
}: React.PropsWithChildren<{
  options: TableOptions<TData>;
}>) {
  const table = useReactTable(optionsProp);

  const contextValue = React.useMemo(
    () => ({ options: table.options, table }),
    [table],
  );
  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
}
DataTableProvider.displayName = "DataTableProvider";

interface DataTableProps<TData extends RowData>
  extends Omit<React.ComponentPropsWithRef<typeof Table>, "children"> {
  classNames?: ClassNames<"body" | "header" | "footer">;
  renderRow?: (row: ReactTable.Row<TData>, index?: number) => React.ReactNode;
}

export function DataTable<TData extends RowData = any>(
  { ref, className, classNames, renderRow, ...props }: DataTableProps<TData>,
) {
  const { table } = useDataTable<TData>();

  function handleRow(row: ReactTable.Row<TData>, index?: number) {
    if (renderRow) {
      return renderRow(row, index);
    }
    return <DataTableRow key={index} row={row} />;
  }

  return (
    <Table ref={ref} className={cn("w-full", className)} {...props}>
      {/* Table Header */}
      <DataTableHeader className={classNames?.headerClassName} />
      {/* Table Body */}
      <DataTableBody className={classNames?.bodyClassName}>
        {table.getRowCount() === 0
          ? <EmptyTableRow colSpan={table.getAllColumns().length} />
          : (
            table.getPaginationRowModel().rows.map(handleRow)
          )}
      </DataTableBody>
      {/* Table Footer */}
      <DataTableFooter className={classNames?.footerClassName}>
        <TotalRow />
      </DataTableFooter>
    </Table>
  );
}
DataTable.displayName = "DataTable";

export function DataTableHead<TData extends RowData, TValue>({
  ref,
  header,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof TableHead>, "children"> & {
  header?: ReactTable.Header<TData, TValue>;
}) {
  if (!header) return null;
  const {
    column: { columnDef },
    getContext,
    isPlaceholder,
  } = header;
  return (
    <TableHead
      ref={ref}
      data-slot="data-table-head"
      className={cn(
        "flex flex-nowrap flex-1 items-center min-w-24 w-fit",
        "cursor-pointer select-none",
        "font-semibold text-sm text-inherit text-nowrap",
        "bg-secondary text-secondary-foreground",
        "hover:bg-primary/10",
      )}
      {...props}
    >
      {isPlaceholder
        ? <Label>{columnDef.id}</Label>
        : flexRender(columnDef.header, getContext())}
    </TableHead>
  );
}
DataTableHead.displayName = "DataTableHead";

export function DataTableHeaderGroup<TData extends RowData = any>({
  ref,
  className,
  group,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof TableRow>, "children"> & {
  group?: ReactTable.HeaderGroup<TData>;
}) {
  return (
    <TableRow
      ref={ref}
      key={group?.id}
      className={cn(
        "flex flex-1 flex-nowrap items-center w-full",
        className,
      )}
      {...props}
    >
      {group?.headers.map((header, index) => (
        <DataTableHead key={index} header={header} />
      ))}
    </TableRow>
  );
}

export const DataTableHeader: React.FC<
  Omit<React.ComponentPropsWithRef<typeof TableHeader>, "children">
> = ({
  ref,
  className,
  ...props
}) => {
  const { table } = useDataTable();
  return (
    <TableHeader
      ref={ref}
      className={cn(
        "relative z-auto flex flex-nowrap items-center w-full",
        className,
      )}
      {...props}
    >
      {table.getHeaderGroups().map((headerGroup, index) => (
        <DataTableHeaderGroup key={index} group={headerGroup} />
      ))}
    </TableHeader>
  );
};

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
      "flex flex-1 items-center justify-center min-w-24 w-full",
      className,
    )}
    {...props}
  />
);
DataTableCell.displayName = "DataTableCell";

export const DataTableBody: React.FC<
  React.ComponentPropsWithRef<typeof TableBody>
> = ({ ref, className, ...props }) => (
  <TableBody
    ref={ref}
    data-slot="data-table-body"
    className={cn("w-full overflow-x-auto", className)}
    {...props}
  />
);

export const DataTableFooter: React.FC<
  React.ComponentPropsWithRef<typeof TableFooter>
> = ({ ref, className, ...props }) => (
  <TableFooter
    ref={ref}
    data-slot="data-table-footer"
    className={cn(
      "w-full",
      className,
    )}
    {...props}
  />
);
DataTableFooter.displayName = "DataTableFooter";

// DataTableActions
export const DataTableActions: React.FC<React.ComponentPropsWithRef<"div">> = (
  { ref, className, ...props },
) => (
  <div
    ref={ref}
    data-slot="data-table-actions"
    className={cn(
      "flex flex-wrap w-full items-center justify-end gap-2",
      className,
    )}
    {...props}
  />
);
DataTableActions.displayName = "DataTableActions";

// TableTitle
export const DataTableTitle: React.FC<
  React.ComponentPropsWithRef<"h2">
> = ({ ref, className, ...props }) => (
  <div
    ref={ref}
    data-slot="data-table-title"
    className={cn(
      "font-semibold text-xl leading-none tracking-tight",
      className,
    )}
    {...props}
  />
);
DataTableTitle.displayName = "DataTableTitle";

// TableDescription
export const DataTableDescription: React.FC<
  React.ComponentPropsWithRef<"span">
> = ({ ref, className, ...props }) => (
  <span
    ref={ref}
    data-slot="data-table-description"
    className={cn(
      "overflow-clip text-sm text-wrap text-muted-foreground",
      className,
    )}
    {...props}
  />
);
DataTableDescription.displayName = "DataTableDescription";
