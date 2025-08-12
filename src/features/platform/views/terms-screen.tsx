/**
 * Created At: 2025.07.25:06:39:24
 * @author - @FL03
 * @file - terms-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import Terms from "../content/terms.mdx";
import { ContentCard } from "../widgets";

export const TermScreen: React.FC<
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
      title="Terms & Conditions"
    >
      <Terms />
    </ContentCard>
  );
};
TermScreen.displayName = "TermScreen";

export default TermScreen;
