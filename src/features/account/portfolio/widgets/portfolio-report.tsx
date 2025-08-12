/**
 * Created At: 2025.07.05:22:16:31
 * @author - @FL03
 * @file - portfolio-report.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

type ReportPropsT = {
  asChild?: boolean;
  className?: string;
};

/** This component renders reports for the users portfolio. */
export const PortfolioReport: React.FC<
  React.PropsWithChildren<ReportPropsT>
> = ({ asChild, className, ...props }) => {
  // fallback to a slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      className={cn(
        "flex flex-col gap-4 p-4 bg-background text-foreground rounded-lg shadow-md",
        className,
      )}
    />
  );
};
PortfolioReport.displayName = "PortfolioReport";

export default PortfolioReport;
