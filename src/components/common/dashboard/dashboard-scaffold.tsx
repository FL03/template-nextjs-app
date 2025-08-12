/**
 * Created At: 2025.07.17:09:16:27
 * @author - @FL03
 * @file - dashboard-scaffold.tsx
 */
"use client";
import * as React from "react";
// local
import { Dashboard, DashboardContent, DashboardLayout } from "./dashboard";
import { DashboardHeader } from "./dashboard-header";
import { DashboardLeading, DashboardTrailing } from "./dashboard-panel";
import { DashboardProvider } from "./dashboard-provider";

/** A collection of classNames that are passed to their corresponding components within the `DashboardScaffold` component. */
type ClassNamesT = {
  contentClassName?: string;
  leadingClassName?: string;
  trailingClassName?: string;
};

type ScaffoldProps = {
  classNames?: ClassNamesT;
  title?: React.ReactNode;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  headerLeading?: React.ReactNode;
  headerTrailing?: React.ReactNode;
  headerContent?: React.ReactNode;
  fullWidth?: boolean;
  hideDescription?: boolean;
};

/** The `DashboardScaffold` component is a pre-configured dashboard that is intended to be used as a layout with parallel, intercepting routes.*/
export const DynamicDashboard: React.FC<
  & React.ComponentPropsWithRef<typeof Dashboard>
  & React.PropsWithChildren<ScaffoldProps>
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
  // returns true if the content should display full width
  const isFullWidth = fullWidth || Boolean(leading) || Boolean(trailing);
  // render the component
  return (
    <DashboardProvider>
      <Dashboard {...props} ref={ref}>
        {hasHeader && (
          <DashboardHeader
            description={description}
            title={title}
            leading={headerLeading}
            trailing={headerTrailing}
            titleSize="xl"
            hideDescription={hideDescription}
          >
            {headerContent}
          </DashboardHeader>
        )}
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
            fullWidth={isFullWidth}
            className={contentClassName}
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
