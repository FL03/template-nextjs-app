/**
 * Created At: 2025.07.17:09:05:00
 * @author - @FL03
 * @file - dashboard.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
// local
import { DashboardSectionVariants, dashboardSectionVariants } from "./variants";

/** The `Dashboard` component is the basis for a dynamic, responsive, and mobile-friendly dashboard scaffold for the platform.  */
export const Dashboard: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the Dashboard component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "relative z-0 flex flex-1 flex-col h-full w-full px-4 py-2",
        className,
      )}
    />
  );
};

/** The `DashboardLayout` component is a wrapper for the main content as well as for both the leading and trailing panels. */
export const DashboardLayout: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "children" | "title">
  & React.PropsWithChildren<{
    asChild?: boolean;
    compact?: boolean;
  }>
> = ({
  ref,
  className,
  asChild,
  compact,
  ...props
}) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "flex flex-1 flex-wrap h-full w-full gap-2 lg:gap-4 relative z-auto",
        className,
      )}
    />
  );
};
DashboardLayout.displayName = "DashboardLayout";

/** The primary display for the dashboard */
export const DashboardContent: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & {
    asChild?: boolean;
    fullWidth?: boolean;
  }
> = ({ ref, className, asChild, fullWidth, ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "order-2 flex flex-col flex-1 h-full w-full overflow-auto gap-4 lg:gap-6",
        !fullWidth && "container mx-auto",
        className,
      )}
    />
  );
};
DashboardContent.displayName = "DashboardContent";

/**
 * The `DashboardSection` component is a versatile and reusable component that can be used to create sections within the dashboard layout.
 * Every _surface_ of the dashboard should be wrapped in this component to ensure consistent styling and behavior, designed to be used as both a panel and the primary content area.
 */
export const DashboardSection: React.FC<
  & Omit<React.ComponentPropsWithRef<"section">, "children" | "style">
  & DashboardSectionVariants
  & React.PropsWithChildren<{ asChild?: boolean; asPanel?: boolean }>
> = ({
  ref,
  className,
  flavor = "default",
  style = "default",
  variant = "default",
  asChild,
  asPanel,
  ...props
}) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "section";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        dashboardSectionVariants({ flavor, style, variant }),
        asPanel && "max-w-1/3",
        className,
      )}
    />
  );
};
DashboardSection.displayName = "DashboardSection";
