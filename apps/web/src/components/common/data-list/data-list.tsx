/**
 * Created At: 2025.11.14:20:01:44
 * @author - @FL03
 * @directory - src/components/common/data-list
 * @file - data-list.tsx
 */
"use client";
// imports
import React from "react";
// project
import { cn } from "@/lib/utils";

function DataList(
  { ref, className, ...props }: React.PropsWithChildren<
    React.ComponentPropsWithRef<"div">
  >,
) {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col w-full", className)}
      typeof="list"
      {...props}
    />
  );
}
DataList.displayName = "DataList";

export { DataList };
