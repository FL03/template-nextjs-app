/**
 * Created At: 2025.07.26:15:21:00
 * @author - @FL03
 * @file - provider.tsx
 */
"use client";
// imports
import * as React from "react";

type DataListContext<TData> = {
  data: TData[];
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
};

const DataListContext = React.createContext<DataListContext<any> | null>(null);

export function useDataList<TData>(): DataListContext<TData> {
  // initialize the context
  const context = React.useContext(DataListContext);
  // throw an error if the context is not available
  if (!context) {
    throw new Error("useDataList must be used within a DataListProvider");
  }
  // return the context
  return context;
}

export function DataListProvider<TData>({ children }: React.PropsWithChildren) {
  // initialize the list data
  const [data, setData] = React.useState<TData[]>([]);

  // memoize the data and setData function
  const ctx = React.useMemo(() => ({ data, setData }), [data, setData]);
  // provide the data and setData function to the context
  return (
    <DataListContext.Provider value={ctx}>
      {children}
    </DataListContext.Provider>
  );
}
