/**
 * Created At: 2025.09.14:22:08:01
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table.tsx
 */
"use client";
// imports
import * as React from "react";
import { SearchIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
// project
import { cn } from "@/lib/utils";
// local
import { DataTable, DataTableProvider } from "./data-table";
import { DataTablePagination } from "./data-table-controls";
// components
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type WithTableOptions<TData, T = {}> = T & {
  columns?: any[];
  data?: TData[];
  filter?: string;
  onCellChange?: React.FormEventHandler;
  pagination?: PaginationState;
  rowCount?: number;
  selection?: RowSelectionState;
  sorting?: SortingState;
};

export const DataTableScaffold: React.FC<
  & Omit<React.ComponentPropsWithRef<typeof Card>, "children" | "title">
  & WithTableOptions<any, {
    actions?: React.ReactNode;
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    classNames?: ClassNames<
      "content" | "header" | "table" | "footer" | "title" | "description"
    >;
  }>
> = ({
  ref,
  actions,
  className,
  classNames,
  columns = [],
  data = [],
  rowCount,
  description,
  title,
  showDescription,
  filter: filterProp = "",
  pagination: paginationProp = { pageIndex: 0, pageSize: 10 },
  selection: selectionProp = {},
  sorting: sortingProp = [],
  ...props
}) => {
  const searchRef = React.useRef<HTMLInputElement>(null);
  // initialize the table state
  const [globalFilter, setGlobalFilter] = React.useState(filterProp);
  const [rowSelection, setRowSelection] = React.useState(selectionProp);
  const [sorting, setSorting] = React.useState(sortingProp);
  const [pagination, setPagination] = React.useState(paginationProp);
  // set the table options
  const tableOptions = {
    data,
    columns,
    rowCount,
    state: {
      globalFilter,
      pagination,
      rowSelection,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
  };

  return (
    <DataTableProvider options={tableOptions}>
      <Card
        ref={ref}
        data-slot="data-table-scaffold"
        className={cn(
          "flex flex-col flex-1 h-full w-full relative z-auto gap-4 lg:gap-6",
          className,
        )}
        {...props}
      >
        <CardHeader>
          {title && (
            <CardTitle className={cn("", classNames?.titleClassName)}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription
              className={cn(showDescription ? "not-sr-only" : "sr-only")}
            >
              {description}
            </CardDescription>
          )}
          <CardAction>
            <ButtonGroup>
              <ButtonGroup>
                <Input
                  ref={searchRef}
                  className="max-w-xs"
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  placeholder="Search the table..."
                  value={globalFilter}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    if (searchRef.current) {
                      searchRef.current?.select();
                      searchRef.current?.blur();
                      setGlobalFilter(searchRef.current.value);
                    }
                  }}
                >
                  <SearchIcon className="size-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </ButtonGroup>
              {actions && <ButtonGroup>{actions}</ButtonGroup>}
            </ButtonGroup>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 h-full w-full overflow-auto">
          <DataTable />
        </CardContent>
        <CardFooter className="order-last w-full flex flex-nowrap items-center justify-center">
          <DataTablePagination />
        </CardFooter>
      </Card>
    </DataTableProvider>
  );
};
DataTableScaffold.displayName = "DataTable";

export default DataTableScaffold;
