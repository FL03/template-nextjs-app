/**
 * Created At: 2025.08.05:08:44:44
 * @author - @FL03
 * @file - sample-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// local
import Test from "../content/test.mdx";
// components
import { ContentCard } from "@/components/common/cards";

export const SampleScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ContentCard>,
    "author" | "description" | "title" | "children"
  >
> = ({ ...props }) => (
  <ContentCard
    {...props}
    showDescription
    author="Joe McCain III"
    title="Example"
    description="This is an example content card to demonstrate the structure."
  >
    <Test />
  </ContentCard>
);
SampleScreen.displayName = "SampleScreen";

export default SampleScreen;
