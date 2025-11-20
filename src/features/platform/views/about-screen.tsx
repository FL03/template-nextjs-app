/**
 * Created At: 2025.07.23:16:47:30
 * @author - @FL03
 * @file - about-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import About from "@/content/about.mdx";
// components
import { ArticleCard } from "@/components/common/articles";

export const AboutPage: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ArticleCard>,
    "author" | "children"
  >
> = (
  {
    description = "A little bit about the software and its capabilities.",
    title = "About",
    ...props
  },
) => (
  <ArticleCard
    {...props}
    description={description}
    title={title}
  >
    <About />
  </ArticleCard>
);
AboutPage.displayName = "AboutPage";

export default AboutPage;
