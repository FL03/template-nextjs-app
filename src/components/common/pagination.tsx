/**
 * Created At: 2025.11.19:15:37:39
 * @author - @FL03
 * @directory - src/components/common
 * @file - pagination.tsx
 */
"use client";
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
// components
import { TooltipScaffold } from "@/components/common/tooltips";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
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

/** A custom pagination component  */
export const Pagination: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ButtonGroup>, "children"> & {
    classNames?: ClassNames<
      "select" | "selectLabel" | "content" | "leading" | "trailing"
    >;
    hidePageCount?: boolean;
    pageCount?: number;
    defaultPage?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: React.Dispatch<React.SetStateAction<number>>;
    onPageSizeChange?: React.Dispatch<React.SetStateAction<number>>;
  }
> = (
  {
    ref,
    className,
    classNames,
    hidePageCount,
    page,
    defaultPage = 1,
    pageCount = 1,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    ...props
  },
) => {
  // local state
  const [currentPage, setCurrentPage] = React.useState<number>(
    defaultPage,
  );
  React.useEffect(() => {
    if (page && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [page]);
  const handlePageChange = React.useCallback((next: number) => (
    setCurrentPage((prev) => {
      if (next === prev) return prev;
      const newPage = Math.min(Math.max(1, next), pageCount);
      onPageChange?.(newPage);
      return newPage;
    })
  ), [pageCount, onPageChange]);
  const nextPage = React.useCallback(() => {
    handlePageChange(currentPage + 1);
  }, [currentPage, handlePageChange]);
  function previousPage(
    value: number,
  ): React.MouseEventHandler<HTMLButtonElement> {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      handlePageChange(value - 1);
    };
  }
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
            disabled={currentPage === 1}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              //
              handlePageChange(1);
            }}
          >
            <ArrowLeftToLineIcon className="size-4" />
            <span className="sr-only">First Page</span>
          </Button>
        </TooltipScaffold>
        <TooltipScaffold asChild description="Return to the previous page">
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage === 1}
            onClick={previousPage(currentPage)}
          >
            <ChevronLeftIcon className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
        </TooltipScaffold>
      </ButtonGroup>
      <ButtonGroup className={classNames?.contentClassName}>
        <Select
          value={currentPage.toString()}
          onValueChange={(value) => (
            handlePageChange(Number(value))
          )}
        >
          <SelectTrigger>
            <SelectValue placeholder={currentPage} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Page</SelectLabel>
              {Array.from(Array(pageCount).keys()).map((p, ix) => (
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
                "text-center text-nowrap",
                classNames?.selectLabelClassName,
              )}
            >
              / {pageCount}
            </Label>
          </ButtonGroupText>
        )}
      </ButtonGroup>
      <ButtonGroup className={classNames?.trailingClassName}>
        <TooltipScaffold asChild description="Go to the next page">
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage === pageCount}
            onClick={nextPage}
          >
            <ChevronRightIcon className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </TooltipScaffold>
        <TooltipScaffold asChild description="Go to the last page">
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage === pageCount}
            onClick={() => handlePageChange(pageCount)}
          >
            <ArrowRightToLineIcon className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </TooltipScaffold>
      </ButtonGroup>
    </ButtonGroup>
  );
};
