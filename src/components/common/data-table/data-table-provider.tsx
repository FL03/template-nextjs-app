/**
 * Created At: 2025.11.10:14:11:38
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-provider.tsx
 */
"use client";
// imports
import * as React from "react";
import ReactTable, {
  RowData,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

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