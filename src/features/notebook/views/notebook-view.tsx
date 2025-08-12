"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/common/loaders";

/** The primary interface used to render a notebook optimized with `next/dynamic` */
export const NotebookView: React.FC = () => {
  // dynamically import the notebook
  const Comp = dynamic(async () => await import("../widgets/notebook"), {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center h-full w-full">
        <Spinner showLabel />
      </div>
    ),
  });
  return (
    <>
      <Comp />
    </>
  );
};
NotebookView.displayName = "NotebookView";

export default NotebookView;
