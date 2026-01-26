/**
 * Created At: 2025.11.10:14:17:07
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-pagination.tsx
 */
"use client";
// imports
import * as React from "react";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { useDataTable } from "./data-table-provider";
// components
import { TooltipScaffold } from "@/components/common/tooltips";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DataTablePageSize: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof ButtonGroup>,
    "children" | "defaultValue" | "value" | "onValueChange"
  > & {
    pageSizes?: number[];
    showLabel?: boolean;
    contentSide?: React.ComponentProps<typeof SelectContent>["side"];
  }
> = (
  {
    ref,
    showLabel,
    contentSide = "top",
    pageSizes = [10, 20, 30, 40, 50],
    ...props
  },
) => {
  const { table } = useDataTable();

  const getPageSize = () => table.getState().pagination.pageSize.toString();

  return (
    <ButtonGroup
      ref={ref}
      data-slot="select-page-size"
      {...props}
    >
      <Select
        value={getPageSize()}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Page Size..." />
        </SelectTrigger>
        <SelectContent side={contentSide}>
          <SelectGroup>
            <SelectLabel>Rows</SelectLabel>
            {pageSizes?.map((v, ix) => (
              <SelectItem key={ix} value={v.toString()}>
                {v}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {showLabel && (
        <ButtonGroupText asChild>
          <Label>Rows</Label>
        </ButtonGroupText>
      )}
    </ButtonGroup>
  );
};

/** A custom pagination controller for the `DataTable`  */
export const DataTablePagination: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ButtonGroup>, "children"> & {
    classNames?: ClassNames<
      "select" | "selectLabel" | "content" | "leading" | "trailing"
    >;
    hidePageCount?: boolean;
  }
> = (
  {
    ref,
    className,
    classNames,
    hidePageCount,
    ...props
  },
) => {
  // get the table instance from context
  const { table } = useDataTable();
  // memoize the current page index
  const currentPageIdx = () => (
    table.getState().pagination.pageIndex + 1
  );
  // render
  return (
    <ButtonGroup
      ref={ref}
      data-slot="data-table-pagination"
      className={cn(
        "relative z-auto mx-auto flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      <ButtonGroup className={classNames?.leadingClassName}>
        <TooltipScaffold asChild description="Go back to the first page">
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={table.firstPage}
          >
            <ArrowLeftToLineIcon className="size-4" />
            <span className="sr-only">First Page</span>
          </Button>
        </TooltipScaffold>
        <TooltipScaffold asChild description="Return to the previous page">
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={table.previousPage}
          >
            <ChevronLeftIcon className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
        </TooltipScaffold>
      </ButtonGroup>
      <ButtonGroup className={classNames?.contentClassName}>
        <Select
          value={currentPageIdx().toString()}
          onValueChange={(value) => (
            table.setPageIndex(Number(value) - 1)
          )}
        >
          <SelectTrigger>
            <SelectValue placeholder={currentPageIdx().toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Page</SelectLabel>
              {Array.from(Array(table.getPageCount()).keys()).map((p, ix) => (
                <SelectItem key={ix} value={Number(p + 1).toString()}>
                  {p + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {!hidePageCount && (
          <ButtonGroupText asChild>
            <Label
              className={cn(
                "text-nowrap text-center text-sm items-center",
                classNames?.selectLabelClassName,
              )}
            >
              / {table.getPageCount()}
            </Label>
          </ButtonGroupText>
        )}
      </ButtonGroup>
      <ButtonGroup className={classNames?.trailingClassName}>
        <TooltipScaffold asChild description="Go to the next page">
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={table.nextPage}
          >
            <ChevronRightIcon className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </TooltipScaffold>
        <TooltipScaffold asChild description="Go to the last page">
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={table.lastPage}
          >
            <ArrowRightToLineIcon className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </TooltipScaffold>
      </ButtonGroup>
    </ButtonGroup>
  );
};
