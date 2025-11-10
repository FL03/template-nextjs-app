/**
 * Created At: 2025.07.25:06:39:24
 * @author - @FL03
 * @file - terms-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// content
import Terms from "../content/terms.mdx";
// components
import { ContentCard } from "@/components/common/cards";

export const TermScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ContentCard>,
    "author" | "description" | "title" | "children"
  >
> = ({ ...props }) => (
  <ContentCard
    {...props}
    showDescription
    author="Joe McCain III"
    title="Terms of Service"
    description="This is an example content card to demonstrate the structure."
  >
    <Terms />
  </ContentCard>
);
TermScreen.displayName = "TermScreen";

export default TermScreen;
