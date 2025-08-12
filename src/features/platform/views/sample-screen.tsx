/**
 * Created At: 2025.08.05:08:44:44
 * @author - @FL03
 * @file - sample-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import Test from "../content/test.mdx";
import { ContentCard } from "../widgets";

export const SampleScreen: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof ContentCard>,
    "author" | "description" | "title" | "children"
  >
> = ({ ref, ...props }) => {
  return (
    <ContentCard
      {...props}
      ref={ref}
      author="Joe McCain III"
      title="Example"
      description="This is an example content card to demonstrate the structure."
    >
      <Test />
    </ContentCard>
  );
};
SampleScreen.displayName = "SampleScreen";

export default SampleScreen;
