/**
 * Created At: 2025.10.31:12:53:55
 * @author - @FL03
 * @directory - src/features/platform/views
 * @file - licensing.tsx
 */
"use client";
// imports
import React from "react";
// components
import { ContentCard } from "@/components/common/cards";
// content
import Content from "../content/licensing.mdx";

/** The component used as a fallback for any routes that are not found.  */
export const LicensingScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ContentCard>,
    "author" | "children"
  >
> = (
  {
    description = "A little bit about the software and its capabilities.",
    title = "About",
    ...props
  },
) => (
  <ContentCard
    {...props}
    author="Joe McCain III"
    description={description}
    title={title}
  >
    <Content />
  </ContentCard>
);
LicensingScreen.displayName = "NotFoundCard";
