/**
 * Created At: 2025.07.12:13:43:00
 * @author - @FL03
 * @file - dashboard-header.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
import { TextSize } from "@/types";

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

type HeaderClassNames = {
  leadingClassName?: string;
  trailingClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

type HeaderProps = {
  classNames?: HeaderClassNames;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  title?: React.ReactNode;
  titleSize?: TextSize;
  description?: React.ReactNode;
  descriptionSize?: TextSize;
  hideDescription?: boolean;
};

// Dashboard Header
export const DashboardHeader: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & HeaderProps
> = ({
  ref,
  leading,
  trailing,
  children,
  className,
  title,
  description,
  classNames,
  titleSize = "lg",
  descriptionSize = "base",
  hideDescription,
  ...props
}) => {
  // destructure the classNames object
  const {
    leadingClassName,
    trailingClassName,
    titleClassName,
    descriptionClassName,
  } = classNames || {};
  // render the header component
  return (
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
            "flex flex-nowrap items-center gap-2 w-fit",
            "left-0",
            leadingClassName,
          )}
        >
          {leading}
        </div>
      )}
      <div className="flex flex-col flex-1 top-0">
        {/* Primary */}
        <div className="flex flex-nowrap w-full items-center gap-2 justify-between leading-none tracking-tight">
          {/* Title */}
          {title && (
            <DashboardTitle
              className={titleClassName}
              textSize={titleSize}
            >
              {title}
            </DashboardTitle>
          )}
          <div
            className={cn(
              "ml-auto inline-flex flex-nowrap items-center gap-2 w-fit",
              !trailing && "hidden",
              trailingClassName,
            )}
          >
            {trailing}
          </div>
        </div>
        {/* Description */}
        {description && (
          <DashboardDescription
            className={cn(
              hideDescription ? "sr-only" : "not-sr-only",
              descriptionClassName,
            )}
            textSize={descriptionSize}
          >
            {description}
          </DashboardDescription>
        )}
        {children}
      </div>
    </div>
  );
};
DashboardHeader.displayName = "DashboardHeader";
