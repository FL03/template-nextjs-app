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
import { ContentCard } from "../widgets";

export const AboutScreen: React.FC<
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
      description="A little bit about me!"
      title="About"
    >
      <About />
    </ContentCard>
  );
};
AboutScreen.displayName = "AboutScreen";

export default AboutScreen;
