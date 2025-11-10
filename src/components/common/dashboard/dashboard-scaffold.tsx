/**
 * Created At: 2025.07.17:09:16:27
 * @author - @FL03
 * @file - dashboard-scaffold.tsx
 */
"use client";
import * as React from "react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
import { TextSize } from "@/types";
// local
import {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "./dashboard";
import { DashboardLeading, DashboardTrailing } from "./dashboard-panel";
import { DashboardProvider } from "./dashboard-provider";

// Dashboard Header
const DynamicDashboardHeader: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    titleSize?: TextSize;
    descriptionSize?: TextSize;
    hideDescription?: boolean;
    classNames?: ClassNames<"leading" | "trailing" | "title" | "description">
  }
> = ({
  ref,
  leading,
  trailing,
  children,
  className,
  title,
  description,
  classNames = {},
  titleSize = "lg",
  descriptionSize = "base",
  hideDescription,
  ...props
}) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      "relative z-10 flex flex-nowrap items-center w-full gap-2 lg:gap-4 mb-2",
      className,
    )}
  >
    {/* Leading */}
    {leading && (
      <div
        className={cn(
          "flex flex-nowrap items-center gap-2 h-full w-fit",
          "left-0 order-first",
          classNames.leadingClassName,
        )}
      >
        {leading}
      </div>
    )}
    <div className="flex flex-1 flex-col top-0 h-full">
      {/* Primary */}
      <div className="flex flex-nowrap w-full items-center gap-2 justify-between leading-none tracking-tight">
        <div className="flex flex-col flex-1 mr-auto">
          {/* Title */}
          {title && (
            <DashboardTitle
              className={classNames.titleClassName}
              textSize={titleSize}
            >
              {title}
            </DashboardTitle>
          )}

          {/* Description */}
          {description && (
            <DashboardDescription
              className={cn(
                hideDescription ? "sr-only" : "not-sr-only",
                classNames.descriptionClassName,
              )}
              textSize={descriptionSize}
            >
              {description}
            </DashboardDescription>
          )}
        </div>
        <div
          className={cn(
            "ml-auto inline-flex flex-nowrap items-center gap-2 w-fit",
            !trailing && "hidden",
            classNames.trailingClassName,
          )}
        >
          {trailing}
        </div>
      </div>
      {children}
    </div>
  </div>
);

/** The `DashboardScaffold` component is a pre-configured dashboard that is intended to be used as a layout with parallel, intercepting routes.*/
export const DynamicDashboard: React.FC<
  & Omit<React.ComponentPropsWithRef<typeof Dashboard>, "title">
  & React.PropsWithChildren<{
    classNames?: ClassNames<"content" | "leading" | "trailing">;
    title?: React.ReactNode;
    description?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    headerLeading?: React.ReactNode;
    headerTrailing?: React.ReactNode;
    headerContent?: React.ReactNode;
    fullWidth?: boolean;
    hideDescription?: boolean;
  }>
> = ({
  ref,
  children,
  classNames,
  description,
  title,
  headerContent,
  headerLeading,
  headerTrailing,
  leading,
  trailing,
  fullWidth,
  hideDescription,
  ...props
}) => {
  // destructure the classNames object
  const { contentClassName, leadingClassName, trailingClassName } =
    classNames || {};
  // returns true the header content is provided
  const hasHeader = Boolean(
    headerContent || headerLeading || headerTrailing || title || description,
  );
  // render the component
  return (
    <DashboardProvider isCompact={!fullWidth}>
      <Dashboard {...props} ref={ref}>
        <DashboardHeader>
          {hasHeader && (
            <DynamicDashboardHeader
              description={description}
              title={title}
              leading={headerLeading}
              trailing={headerTrailing}
              titleSize="xl"
              hideDescription={hideDescription}
            >
              {headerContent}
            </DynamicDashboardHeader>
          )}
        </DashboardHeader>
        <DashboardLayout>
          {/* Leading */}
          {leading && (
            <DashboardLeading
              className={leadingClassName}
            >
              {leading}
            </DashboardLeading>
          )}
          {/* Primary View */}
          <DashboardContent
            className={cn(contentClassName, !fullWidth && "container mx-auto")}
          >
            {children}
          </DashboardContent>
          {/* Secondary */}
          {trailing && (
            <DashboardTrailing
              className={trailingClassName}
            >
              {trailing}
            </DashboardTrailing>
          )}
        </DashboardLayout>
      </Dashboard>
    </DashboardProvider>
  );
};
DynamicDashboard.displayName = "DynamicDashboard";

export default DynamicDashboard;
