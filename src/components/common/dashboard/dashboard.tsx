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
import { TextSize } from "@/types";

/** The `Dashboard` component is the basis for a dynamic, responsive, and mobile-friendly dashboard scaffold for the platform.  */
export const Dashboard: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "data-slot">
> = ({ ref, className, ...props }) => (
  <div
    {...props}
    ref={ref}
    data-slot="dashboard"
    className={cn(
      "relative z-0 flex-1 h-full w-full gap-2",
      className,
    )}
  />
);
Dashboard.displayName = "Dashboard";

/** The `DashboardLayout` component is a wrapper for the main content as well as for both the leading and trailing panels. */
export const DashboardLayout: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title">
  & React.PropsWithChildren<{
    compact?: boolean;
  }>
> = ({
  ref,
  className,
  compact,
  ...props
}) => (
  <div
    {...props}
    ref={ref}
    data-slot="dashboard-layout"
    className={cn(
      "relative z-auto flex flex-1 flex-wrap h-full w-full gap-2 lg:gap-4 p-2",
      className,
    )}
  />
);
DashboardLayout.displayName = "DashboardLayout";

export const DashboardHeader: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title">
> = ({ ref, className, ...props }) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      "order-first w-full",
      className,
    )}
  />
);

/** The primary display for the dashboard */
export const DashboardContent: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-content"
      className={cn(
        "col-span-3 flex flex-col flex-1 h-full w-full gap-4 lg:gap-6",
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
  & Omit<
    React.ComponentPropsWithRef<"section">,
    "data-slot" | "title" | "hidden"
  >
  & { asChild?: boolean }
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "section";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-section"
      className={cn(
        "flex flex-1 flex-col h-full w-full gap-2 px-4 py-2",
        "bg-accent text-accent-foreground border-accent/10 border rounded-lg",
        className,
      )}
    />
  );
};
DashboardSection.displayName = "DashboardSection";

// Dashboard Description
export const DashboardDescription: React.FC<
  React.ComponentPropsWithRef<"span"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, textSize = "sm", ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "span";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "text-muted-foreground",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
DashboardDescription.displayName = "DashboardDescription";

// Dashboard Title
export const DashboardTitle: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, textSize = "lg", ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
DashboardTitle.displayName = "DashboardTitle";
