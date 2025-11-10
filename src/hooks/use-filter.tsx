/**
 * Created At: 2025.10.03:22:00:56
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-filter.tsx
 */
"use client";
// imports
import * as React from "react";

namespace UseFilter {
  export interface Filter<TData> {
    key: keyof TData;
    value?: string | null;
  }

  export interface Props<TData> {
    values: TData[];
  }

  export interface Output<TData> {
    data: TData[];
    filter: Filter<TData> | null;
    setFilter: React.Dispatch<
      React.SetStateAction<Filter<TData> | null>
    >;
    filterBy(key: keyof TData, value: string | null): void;
  }

  export type Hook<TData> = (options?: Props<TData>) => Output<TData>;
}

/**
 * The `useFilter` hook works to provide a dynamic filter for the given dataset. The resulting data is memoized and automatically
 * updated whenever any changes occur to the original dataset or the filter criteria. Each filter is essentially defined as a key-value pair,
 * where they key represents the property to filter by, and the value is the specific value to match against.
 */
export function useFilter<TData = unknown>(
  { values = [] }: UseFilter.Props<TData>,
): UseFilter.Output<TData> {
  // setup the filter
  const [filter, setFilter] = React.useState<UseFilter.Filter<TData> | null>(
    null,
  );

  const filterBy = React.useCallback(
    (key: keyof TData, value: string | null) => {
      setFilter({ key, value });
    },
    [],
  );

  // Filter data by orgId
  const filtered = React.useMemo(
    () => {
      if (!filter || !filter?.value) return values;
      return values?.filter((item) => item[filter.key] === filter.value);
    },
    [values, filter],
  );
  return {
    data: filtered,
    filter,
    filterBy,
    setFilter,
  };
}
