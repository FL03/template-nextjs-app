/**
 * Created At: 2025.10.31:12:19:05
 * @author - @FL03
 * @directory - src/features/shifts/widgets/table
 * @file - shift-table.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames, formatAsCurrency } from "@pzzld/core";
import {
  aggregationFns,
  ColumnHelper,
  createColumnHelper,
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
// feature-specific
import { useWorkSchedule } from "../providers";
import { type ShiftData } from "../types";
import { ShiftFormModal } from "./modals";
import {
  ShiftCommandDialog,
  ShiftDropdownMenu,
  ShiftsDropdownMenu,
} from "./actions";
// components
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePageSize,
  DataTablePagination,
  DataTableProvider,
  DataTableSearch,
} from "@/components/common/data-table";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Item, ItemContent } from "@/components/ui/item";

type PropsWithTableConfig<T = {}> = T & {
  filter?: string;
  pagination?: PaginationState;
  rowCount?: number;
  selection?: RowSelectionState;
  sorting?: SortingState;
  onCellChange?: React.FormEventHandler;
};

/** Initialize a column helper for the shifts table. */
export const shiftColHelper: ColumnHelper<ShiftData> = createColumnHelper<
  ShiftData
>();
/** Define the shift table schema */
export const shiftTableSchema = [
  shiftColHelper.display({
    id: "select",
    footer: () => <span className="font-semibold">Totals</span>,
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        checked={table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-auto"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  }),
  shiftColHelper.accessor("date", {
    id: "date",
    enableGrouping: true,
    enableSorting: true,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>
        Date
      </DataTableColumnHeader>
    ),
    cell: ({ row: { original: { date } } }) => (
      new Date(date).toLocaleDateString("en-US", {
        timeZone: "UTC",
      })
    ),
  }),
  shiftColHelper.accessor("tips_cash", {
    id: "tips_cash",
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>
        Cash
      </DataTableColumnHeader>
    ),
    aggregationFn: aggregationFns.sum,
    cell: ({ row }) => (
      formatAsCurrency(row.original.tips_cash)
    ),
  }),
  shiftColHelper.accessor("tips_credit", {
    id: "tips_credit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>
        Credit
      </DataTableColumnHeader>
    ),
    aggregationFn: aggregationFns.sum,
    cell: ({ row }) => (
      formatAsCurrency(row.original.tips_credit)
    ),
  }),
  shiftColHelper.display({
    id: "total_tips",
    cell: ({ row }) => {
      const { tips_cash: cash = 0, tips_credit: credit = 0 } = row.original;

      return formatAsCurrency(cash + credit);
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>
        Earned Tips
      </DataTableColumnHeader>
    ),
    aggregationFn: (_columnId, leafRows, childRows) => {
      const total = leafRows.reduce((acc, row) => {
        const { tips_cash: cash = 0, tips_credit: credit = 0 } = row.original;
        return acc + cash + credit;
      }, 0);
      return childRows.reduce((acc, row) => {
        const { tips_cash: cash = 0, tips_credit: credit = 0 } = row.original;
        return acc + cash + credit;
      }, total);
    },
    aggregatedCell: ({ getValue }) => {
      const total = getValue<number>();
      return formatAsCurrency(total);
    },
  }),
  shiftColHelper.display({
    id: "actions",
    aggregationFn: aggregationFns.count,
    cell: (props) => <ShiftDropdownMenu item={props.row.original} />,
  }),
];

export const ShiftTable: React.FC<
  & Omit<
    React.ComponentPropsWithoutRef<"div">,
    "children" | "title" | "data-slot"
  >
  & PropsWithTableConfig<{
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    classNames?: ClassNames<
      "content" | "description" | "title" | "header" | "actions" | "footer"
    >;
  }>
> = ({
  className,
  classNames = {},
  rowCount,
  showDescription,
  title = "Shifts",
  description = "View and manage your shifts as a table.",
  filter: filterProp = "",
  pagination: paginationProp = { pageIndex: 0, pageSize: 10 },
  selection: selectionProp = {},
  sorting: sortingProp = [],
  ...props
}) => {
  // context
  const { data } = useWorkSchedule();
  // states
  const [globalFilter, setGlobalFilter] = React.useState(filterProp);
  const [rowSelection, setRowSelection] = React.useState(selectionProp);
  const [sorting, setSorting] = React.useState(sortingProp);
  const [pagination, setPagination] = React.useState(paginationProp);
  // set the table options
  const tableOptions = {
    data,
    columns: shiftTableSchema,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    rowCount,
    state: {
      globalFilter,
      pagination,
      rowSelection,
      sorting,
    },
  };

  const TableActions = ({ className }: { className?: string } = {}) => (
    <ButtonGroup
      className={cn(
        "flex-wrap-reverse items-center justify-end w-full px-6",
        className,
      )}
    >
      <DataTableSearch />
      <ButtonGroup>
        <ShiftFormModal />
        <ShiftsDropdownMenu />
      </ButtonGroup>
    </ButtonGroup>
  );

  return (
    <DataTableProvider options={tableOptions}>
      <Card
        {...props}
        className={cn(
          "relative z-auto flex flex-1 flex-col w-full",
          className,
        )}
      >
        <CardHeader
          className={cn(
            "w-full",
            classNames?.headerClassName,
          )}
        >
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {description && (
            <CardDescription
              className={cn(
                showDescription ? "not-sr-only" : "sr-only",
                classNames?.descriptionClassName,
              )}
            >
              {description}
            </CardDescription>
          )}
          <CardAction>
            <DataTablePageSize />
          </CardAction>
        </CardHeader>
        <CardContent
          className={cn(
            "flex flex-1 flex-col h-full w-full gap-2 px-0",
            classNames?.contentClassName,
          )}
        >
          <TableActions />
          <DataTable />
        </CardContent>
        <CardFooter className="flex flex-nowrap items-center justify-center w-full">
          <Item>
            <ItemContent className="w-full justify-center">
              <DataTablePagination />
            </ItemContent>
          </Item>
        </CardFooter>
        <ShiftCommandDialog />
      </Card>
    </DataTableProvider>
  );
};
ShiftTable.displayName = "ShiftTable";

export default ShiftTable;
