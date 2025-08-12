/**
 * Created At: 2025.07.05:22:16:31
 * @author - @FL03
 * @file - portfolio.tsx
 */
"use client";
// imports
import * as React from "react";
// components
import { DashboardSection } from "@/components/common/dashboard";

/** This component renders reports for the users portfolio. */
export const PortfolioDashboardContent: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof DashboardSection>,
    "children" | "title"
  >
> = ({ ref, flavor = "accent", variant = "default", ...props }) => {
  // render the component
  return (
    <DashboardSection {...props} ref={ref} flavor={flavor} variant={variant}>
    </DashboardSection>
  );
};
PortfolioDashboardContent.displayName = "PortfolioDashboardContent";

export default PortfolioDashboardContent;
