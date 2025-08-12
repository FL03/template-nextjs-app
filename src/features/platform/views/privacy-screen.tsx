/**
 * Created At: 2025.07.23:16:47:30
 * @author - @FL03
 * @file - about-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import Privacy from "../content/privacy.mdx";
import { ContentCard } from "../widgets";

export const PrivacyScreen: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof ContentCard>,
    "author" | "description" | "title" | "children"
  >
> = ({ ref, ...props }) => {
  return (
    <ContentCard
      {...props}
      ref={ref}
      title="Privacy Policy"
    >
      <Privacy />
    </ContentCard>
  );
};
PrivacyScreen.displayName = "PrivacyScreen";

export default PrivacyScreen;
