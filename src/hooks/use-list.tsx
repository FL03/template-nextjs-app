/**
 * Created At: 2025.07.26:15:20:48
 * @author - @FL03
 * @file - use-list.tsx
 */
'use client';

import * as React from 'react';

type ListHookParams<TData> = {
  values?: TData[];
  handleOnChange?: (data: TData[]) => void;
};
/**
 * A hook designed for the `list-view` component to manage a set of items.
 * @param {TData[]} values -The set of values to be managed by the hook.
 * @returns
 */
export function useList<TData>({ values = [] }: ListHookParams<TData>) {
  // declare stateful variables for the data
  const [_data, _setData] = React.useState<TData[]>(values);

  // redeclare public variables and methods
  const data = _data;
  const setData = _setData;

  // base effects
  React.useEffect(() => {}, []);

  return React.useMemo(
    () => ({
      data,
      setData,
    }),
    [data, setData]
  );
}
