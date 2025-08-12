/**
 * Created At: 2025.07.13:10:07:27
 * @author - @FL03
 * @file - dashboard-panel.tsx
 */
"use client";
// import
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
// local
import { useDashboard } from "./dashboard-provider";
import { DashboardDrawer, DashboardSheet } from "./modal";

/** The `DashboardPanel` describes the optional, dynamic secondary display often used when constructing dashboards. */
const DashboardPanel: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & {
    asChild?: boolean;
    isTrailing?: boolean;
  }
> = ({ ref, className, asChild, isTrailing, ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "flex flex-col flex-shrink-0 h-full w-full lg:max-w-sm",
        "gap-2 lg:gap-4 overflow-y-auto",
        isTrailing ? "order-last bottom-0 right-0" : "order-first left-0 top-0",
        className,
      )}
    />
  );
};
DashboardPanel.displayName = "DashboardPanel";

/**
 * The _**leading**_ panel of the dashboard layout that dynamically renders the content as a sheet located on the left-hand side of the screen that is
 * triggered whenever the corresponding button is clicked.
 */
export const DashboardLeading: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof DashboardPanel>,
    "asChild" | "isTrailing"
  > & {
    asModal?: boolean;
  }
> = ({ ref, className, asModal, ...props }) => {
  // get a reference to the dashboard context
  const { isMobile } = useDashboard();
  // handle
  if (isMobile || asModal) {
    return (
      <DashboardSheet
        className="mt-2"
        triggerClassName={cn(
          "fixed left-2 bottom-6 z-[99]",
          "bg-primary text-primary-foreground transition-all",
          "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        <DashboardPanel asChild ref={ref} className={className} {...props} />
      </DashboardSheet>
    );
  }
  // render the Sidebar component
  return <DashboardPanel ref={ref} className={className} {...props} />;
};
DashboardLeading.displayName = "DashboardLeading";

export const DashboardTrailing: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof DashboardPanel>,
    "asChild" | "isTrailing"
  > & {
    asModal?: boolean;
  }
> = ({ ref, className, asModal, ...props }) => {
  const { isMobile } = useDashboard();
  // if the dashboard is mobile, render the drawer
  if (isMobile || asModal) {
    return (
      <DashboardDrawer
        className="flex flex-col flex-1 w-full px-4 py-2"
        triggerClassName="static fixed bottom-6 right-2 z-[99] ml-auto"
      >
        <DashboardPanel asChild isTrailing ref={ref} className={className} {...props} />
      </DashboardDrawer>
    );
  }
  // otherwise, render the panel directly
  return <DashboardPanel isTrailing ref={ref} className={className} {...props} />;
};
DashboardTrailing.displayName = "DashboardTrailing";
