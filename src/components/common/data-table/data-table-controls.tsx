/**
 * Created At: 2025.11.02:10:22:15
 * @author - @FL03
 * @directory - src/components/common/data-table-controls
 * @file - pagination.tsx
 */
"use client";
// imports
import * as React from "react";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { useDataTable } from "./data-table";
// components
import { TooltipScaffold } from "@/components/common/tooltips";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      data-slot="data-table-row-control"
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

// DataTableSearch
export const DataTableSearch: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ButtonGroup>, "children"> & {
    classNames?: ClassNames<"icon" | "button" | "input" | "label">;
    showButtonLabel?: boolean;
  }
> = ({ ref, className, classNames, showButtonLabel, ...props }) => {
  const { table } = useDataTable();
  const searchRef = React.useRef<HTMLInputElement>(null);
  return (
    <ButtonGroup {...props}>
      <Input
        ref={searchRef}
        className={cn(
          "w-full max-w-[150px] md:max-w-[200px]",
          classNames?.inputClassName,
        )}
        onChange={(event) => {
          table.setGlobalFilter(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            table.setGlobalFilter("");
          }
          if (event.key === "Enter") {
            event.currentTarget.select();
            event.currentTarget.blur();
          }
        }}
        placeholder="Search..."
        value={table.getState().globalFilter}
      />
      <Button
        id="data-table-search-btn"
        className={cn("", classNames?.buttonClassName)}
        size="icon"
        variant="outline"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          // use the ref to focus the input
          searchRef.current?.select();
          searchRef.current?.blur();
          table.setGlobalFilter(searchRef.current?.value || "");
        }}
      >
        <SearchIcon className={cn("size-4", classNames?.iconClassName)} />
        <Label
          htmlFor="data-table-search-btn"
          className={cn(
            showButtonLabel ? "not-sr-only" : "sr-only",
            classNames?.labelClassName,
          )}
        >
          Search
        </Label>
      </Button>
    </ButtonGroup>
  );
};

export const DataTableSearchPopover: React.FC<
  React.ComponentPropsWithoutRef<typeof Popover> & {
    triggerSize?: React.ComponentProps<typeof Button>["size"];
    triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  }
> = ({ triggerSize = "icon", triggerVariant = "ghost", ...props }) => (
  <Popover {...props}>
    <PopoverTrigger asChild>
      <Button size="icon" variant="outline">
        <SearchIcon className="size-4" />
        <span
          className={cn(
            triggerSize?.startsWith("icon") ? "sr-only" : "not-sr-only",
          )}
        >
          Search
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-2">
      <DataTableSearch showButtonLabel />
    </PopoverContent>
  </Popover>
);

/** A custom pagination controller for the `DataTable`  */
export const DataTablePagination: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ButtonGroup>, "children"> & {
    compact?: boolean;
    classNames?: ClassNames<
      "select" | "selectLabel" | "content" | "leading" | "trailing"
    >;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
  }
> = (
  {
    ref,
    className,
    classNames,
    compact,
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
        "relative z-auto mx-auto flex-1 items-center w-full",
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
        {!compact && (
          <ButtonGroupText asChild>
            <Label
              className={cn("text-nowrap", classNames?.selectLabelClassName)}
            >
              / {table.getPageCount()}
            </Label>
          </ButtonGroupText>
        )}
      </ButtonGroup>
      <ButtonGroup className={classNames?.trailingClassName}>
        <Button
          size="icon"
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={table.nextPage}
        >
          <ChevronRightIcon className="size-4" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button
          size="icon"
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={table.lastPage}
        >
          <ArrowRightToLineIcon className="size-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
};
