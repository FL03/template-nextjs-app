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

/** The `Dashboard` component is the basis for a dynamic, responsive, and mobile-friendly dashboard scaffold for the platform.  */
export const Dashboard: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard"
      className={cn(
        "relative z-0 flex-1 h-full w-full gap-2",
        className,
      )}
    />
  );
};
Dashboard.displayName = "Dashboard";

/** The `DashboardLayout` component is a wrapper for the main content as well as for both the leading and trailing panels. */
export const DashboardLayout: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title">
  & React.PropsWithChildren<{
    asChild?: boolean;
    compact?: boolean;
  }>
> = ({ ref, className, asChild, compact, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-layout"
      className={cn(
        "relative z-auto flex flex-1 flex-nowrap h-full w-full items-center p-2 gap-4 lg:gap-6",
        className,
      )}
    />
  );
};
DashboardLayout.displayName = "DashboardLayout";

/** The primary display for the dashboard */
export const DashboardContent: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : "div";
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
        "flex flex-1 flex-col h-full w-full gap-2 lg:gap-4",
        className,
      )}
    />
  );
};
DashboardSection.displayName = "DashboardSection";

export const DashboardHeader: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-header"
      className={cn(
        "relative z-auto order-first w-full",
        className,
      )}
    />
  );
};
DashboardHeader.displayName = "DashboardHeader";

// DashboardFooter
export const DashboardFooter: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-footer"
      className={cn(
        "order-first w-full",
        className,
      )}
    />
  );
};
DashboardFooter.displayName = "DashboardFooter";

// DashboardDescription
export const DashboardDescription: React.FC<
  React.ComponentPropsWithRef<"span"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-description"
      className={cn(
        "text-muted-foreground line-clamp-2 truncate leading-none tracking-tight",
        hidden ? "sr-only" : "not-sr-only",
        className,
      )}
    />
  );
};
DashboardDescription.displayName = "DashboardDescription";

// DashboardTitle
export const DashboardTitle: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-title"
      className={cn(
        "text-xl font-semibold leading-none tracking-tight",
        hidden ? "sr-only" : "not-sr-only",
        className,
      )}
    />
  );
};
DashboardTitle.displayName = "DashboardTitle";

// DashboardLabel
export const DashboardLabel: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-label"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        hidden ? "sr-only" : "not-sr-only",
        className,
      )}
    />
  );
};
DashboardLabel.displayName = "DashboardLabel";
