/**
 * Created At: 2025.11.10:14:17:30
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - data-table-search.tsx
 */
"use client";
// imports
import * as React from "react";
import { SearchIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { useDataTable } from "./data-table-provider";
// components
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
