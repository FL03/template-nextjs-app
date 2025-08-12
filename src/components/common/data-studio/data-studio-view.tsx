/**
 * Created At: 2025.08.05:04:44:55
 * @author - @FL03
 * @file - data-studio-view.tsx
 */
"use client";
// imports
import dynamic from "next/dynamic";
import React from "react";

/** A _**view**_ of the `DataStudio` component useful for isolating the component through dynamic imports in a effort to reduce the frequency and scope of any re-render. */
export const DataStudioView: React.FC = () => {
  // dynamically import the target component
  const Comp = dynamic(
    async () => await import("./data-studio"),
    { ssr: false },
  );
  return <Comp />;
};
DataStudioView.displayName = "DataStudioView";

export default DataStudioView;
