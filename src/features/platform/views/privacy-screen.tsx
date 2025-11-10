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
// components
import { ContentCard } from "@/components/common/cards";
export const PrivacyScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ContentCard>,
    "title" | "children" | "showDescription"
  >
> = ({ ...props }) => (
  <ContentCard
    {...props}
    showDescription
    title="Privacy Policy"
  >
    <Privacy />
  </ContentCard>
);
PrivacyScreen.displayName = "PrivacyScreen";

export default PrivacyScreen;
