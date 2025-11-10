/**
 * Created At: 2025.07.23:16:47:30
 * @author - @FL03
 * @file - about-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import About from "../content/about.mdx";
// components
import { ContentCard } from "@/components/common/cards";

export const AboutPage: React.FC<
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
    description={description}
    title={title}
  >
    <About />
  </ContentCard>
);
AboutPage.displayName = "AboutPage";

export default AboutPage;
