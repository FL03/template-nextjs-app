/**
 * Created At: 2025.07.27:14:34:51
 * @author - @FL03
 * @file - portfolio-leading.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { DashboardSection } from "@/components/common/dashboard";

export const PortfolioDashboardTrailing: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof DashboardSection>,
    "children" | "title"
  > & {
    username?: string;
    view?: string;
  }
> = ({ ref, className, username, ...props }) => {
  // warn if username is not provided
  if (!username) {
    logger.warn(
      "No username was passed onto the PortfolioDashboardTrailing component.",
    );
  }

  // render the component
  return (
    <DashboardSection
      {...props}
      ref={ref}
      className={cn("flex flex-1 flex-col h-full gap-2", className)}
    >
      Trailing...
    </DashboardSection>
  );
};
PortfolioDashboardTrailing.displayName = "PortfolioDashboardTrailing";

export default PortfolioDashboardTrailing;
