/**
 * Created At: 2025.11.01:13:52:11
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - parts.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ClassNames } from '@pzzld/core';
import ReactTable, { flexRender, RowData } from '@tanstack/react-table';
// project
import { cn } from '@/lib/utils';
// local
import { useDataTable } from './data-table-provider';
import { DataTableEmptyRow, DataTableRow } from './data-table-rows';
// components
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<
  TData extends RowData,
> extends React.ComponentPropsWithRef<typeof Table> {
  classNames?: ClassNames<'tableBody' | 'tableHeader' | 'tableFooter'>;
  renderRow?: (row: ReactTable.Row<TData>, index?: number) => React.ReactNode;
}

export function DataTable<TData extends RowData = any>({
  ref,
  children,
  className,
  classNames,
  renderRow,
  ...props
}: DataTableProps<TData>) {
  const { table } = useDataTable<TData>();

  function handleRow(row: ReactTable.Row<TData>, index?: number) {
    if (renderRow) return renderRow(row, index);
    return <DataTableRow key={index} row={row} />;
  }

  return (
    <Table ref={ref} className={cn('w-full', className)} {...props}>
      {/* Table Header */}
      <DataTableHeader className={classNames?.tableHeaderClassName} />
      {/* Table Body */}
      <TableBody
        className={cn('w-full overflow-y-auto', classNames?.tableBodyClassName)}
      >
        {table.getRowCount() === 0 ? (
          <DataTableEmptyRow colSpan={table.getAllColumns().length} />
        ) : (
          table.getPaginationRowModel().rows.map(handleRow)
        )}
      </TableBody>
      {/* Table Footer */}
      <TableFooter
        className={cn('w-full', classNames?.tableFooterClassName)}
        hidden={!children}
      >
        {children}
      </TableFooter>
    </Table>
  );
}

export function DataTableHead<TData extends RowData, TValue>({
  ref,
  className,
  header,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof TableHead>, 'children'> & {
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
      data-slot='data-table-head'
      className={cn(
        'flex flex-nowrap flex-1 items-center min-w-24 w-fit',
        'bg-secondary text-secondary-foreground font-semibold text-nowrap truncate',
        'cursor-pointer select-none transition-opacity ease-in-out duration-75',
        'hover:opacity-80 ring-none focus:ring-none',
        className,
      )}
      {...props}
    >
      {isPlaceholder ? (
        <Label>{columnDef.id}</Label>
      ) : (
        flexRender(columnDef.header, getContext())
      )}
    </TableHead>
  );
}
DataTableHead.displayName = 'DataTableHead';

export function DataTableHeaderGroup<TData extends RowData = any>({
  ref,
  className,
  group,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof TableRow>, 'children'> & {
  group?: ReactTable.HeaderGroup<TData>;
}) {
  return (
    <TableRow
      ref={ref}
      key={group?.id}
      className={cn('flex flex-1 flex-nowrap items-center w-full', className)}
      {...props}
    >
      {group?.headers.map((header, index) => (
        <DataTableHead key={index} header={header} />
      ))}
    </TableRow>
  );
}

export const DataTableHeader: React.FC<
  Omit<React.ComponentPropsWithRef<typeof TableHeader>, 'children'>
> = ({ ref, className, ...props }) => {
  const { table } = useDataTable();
  return (
    <TableHeader
      ref={ref}
      className={cn(
        'relative z-auto flex flex-nowrap items-center w-full',
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

// DataTableActions
export const DataTableActions: React.FC<React.ComponentPropsWithRef<'div'>> = ({
  ref,
  className,
  ...props
}) => (
  <div
    ref={ref}
    data-slot='data-table-actions'
    className={cn(
      'flex flex-wrap w-full items-center justify-end gap-2',
      className,
    )}
    {...props}
  />
);
DataTableActions.displayName = 'DataTableActions';

// TableTitle
export const DataTableTitle: React.FC<React.ComponentPropsWithRef<'h2'>> = ({
  ref,
  className,
  ...props
}) => (
  <div
    ref={ref}
    data-slot='data-table-title'
    className={cn(
      'font-semibold text-xl leading-none tracking-tight',
      className,
    )}
    {...props}
  />
);
DataTableTitle.displayName = 'DataTableTitle';

// TableDescription
export const DataTableDescription: React.FC<
  React.ComponentPropsWithRef<'span'>
> = ({ ref, className, ...props }) => (
  <span
    ref={ref}
    data-slot='data-table-description'
    className={cn(
      'overflow-clip text-sm text-wrap text-muted-foreground',
      className,
    )}
    {...props}
  />
);
DataTableDescription.displayName = 'DataTableDescription';

export const DataTableSelectedRows: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Label>, 'children'> & {
    compact?: boolean;
  }
> = ({ ref, compact, ...props }) => {
  const { table } = useDataTable();
  return (
    <Label ref={ref} {...props}>
      <span>Selected {table.getFilteredRowModel().rows.length}</span>
      {!compact && <span>out of {} items</span>}
    </Label>
  );
};
