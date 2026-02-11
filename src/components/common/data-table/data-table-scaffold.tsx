/**
 * Created At: 2025.11.10:14:17:23
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-scaffold.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ClassNames } from '@pzzld/core';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
// project
import { cn } from '@/lib/utils';
// local
import { DataTable } from './data-table';
import {
  DataTablePageSize,
  DataTablePagination,
} from './data-table-pagination';
import { DataTableProvider } from './data-table-provider';
import { DataTableSearch } from './data-table-search';
// components
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  Omit<React.ComponentPropsWithRef<typeof Card>, 'children' | 'title'> &
    WithTableOptions<
      any,
      {
        actions?: React.ReactNode;
        description?: React.ReactNode;
        title?: React.ReactNode;
        showDescription?: boolean;
        hidePageSize?: boolean;
        classNames?: ClassNames<
          'content' | 'header' | 'table' | 'footer' | 'title' | 'description'
        >;
      }
    >
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
  hidePageSize,
  showDescription,
  filter: filterProp = '',
  pagination: paginationProp = { pageIndex: 0, pageSize: 10 },
  selection: selectionProp = {},
  sorting: sortingProp = [],
  ...props
}) => {
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
        data-slot='data-table-scaffold'
        className={cn(
          'flex flex-col flex-1 h-full w-full relative z-auto gap-4 lg:gap-6',
          className,
        )}
        {...props}
      >
        <CardHeader className={cn('w-full', classNames?.headerClassName)}>
          <CardTitle
            className={cn('', classNames?.titleClassName)}
            hidden={!title}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={cn(
              showDescription ? 'not-sr-only' : 'sr-only',
              classNames?.descriptionClassName,
            )}
            hidden={!description}
          >
            {description}
          </CardDescription>
          <CardAction hidden={hidePageSize}>
            <DataTablePageSize />
          </CardAction>
        </CardHeader>
        <CardContent
          className={cn(
            'flex flex-col flex-1 h-full w-full gap-2 p-0',
            classNames?.contentClassName,
          )}
        >
          <ButtonGroup className='px-6 justify-end w-full'>
            <ButtonGroup>
              <DataTableSearch />
            </ButtonGroup>
            {actions && <ButtonGroup>{actions}</ButtonGroup>}
          </ButtonGroup>
          <DataTable />
        </CardContent>
        <CardFooter
          className={cn(
            'flex flex-nowrap items-center justify-center w-full',
            classNames?.footerClassName,
          )}
        >
          <DataTablePagination />
        </CardFooter>
      </Card>
    </DataTableProvider>
  );
};
DataTableScaffold.displayName = 'DataTable';
