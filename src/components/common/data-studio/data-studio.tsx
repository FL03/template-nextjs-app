/**
 * Created At: 2025.08.05:04:46:19
 * @author - @FL03
 * @file - data-studio.tsx
 */
"use client";
// imports
import React from "react";
// project
import { cn } from "@/lib/utils";
import { Header, HeaderContent, HeaderTitle } from "@/components/common/header";

type DataStudioPropsT = {};

/** The `DataStudio` component is a dynamic editor for **any** digital content, featuring a polyglot engine imbued with generative intelligence. */
export const DataStudio: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "children" | "title" | "id">
  & DataStudioPropsT
> = ({ ref, className, ...props }) => {
  return (
    <div
      {...props}
      ref={ref}
      id="data-studio"
      className={cn("flex flex-col flex-1 gap-2 px-4 py-2", className)}
    >
      <Header>
        <HeaderContent>
          <HeaderTitle>Data Studio</HeaderTitle>
        </HeaderContent>
      </Header>
      <section></section>
    </div>
  );
};

DataStudio.displayName = "DataStudio";

export default DataStudio;
