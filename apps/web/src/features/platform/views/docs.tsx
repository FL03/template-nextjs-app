/**
 * Created At: 2025.10.06:17:41:19
 * @author - @FL03
 * @directory - src/features/platform/views
 * @file - docs.tsx
 */
"use client";
// imports
import * as React from "react";
// local
import Docs from "@/content/docs.mdx";
// components
import { ArticleCard } from "@/components/common/articles";

export const DocsScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ArticleCard>,
    "author" | "children"
  >
> = (
  {
    description = "A little bit Docs the software and its capabilities.",
    title = "Docs",
    ...props
  },
) => (
  <ArticleCard
    {...props}
    description={description}
    title={title}
  >
    <Docs />
  </ArticleCard>
);
DocsScreen.displayName = "DocsScreen";

export default DocsScreen;
