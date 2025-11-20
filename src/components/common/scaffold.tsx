/**
 * Created At: 2025-04-04:16:00:40
 * @author - @FL03
 * @description - Scaffold Component
 * @file - scaffold.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

// Scaffold
export const Scaffold: React.FC<
  & React.ComponentPropsWithRef<"div">
  & React.PropsWithChildren<{ asChild?: boolean }>
> = (
  {
    ref,
    className,
    asChild,
    ...props
  },
) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="scaffold"
      className={cn(
        "relative z-auto flex-1 h-full w-full",
        "in-data-[slot=scaffold] flex flex-col",
        className,
      )}
      {...props}
    />
  );
};
Scaffold.displayName = "Scaffold";

// ScaffoldContent
export const ScaffoldContent: React.FC<
  & React.ComponentPropsWithRef<"div">
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
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="scaffold-content"
      className={cn(
        "flex flex-1 flex-col h-full w-full gap-2 p-4",
        compact && "container mx-auto",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldContent.displayName = "ScaffoldContent";

// ScaffoldNav
export const ScaffoldNav: React.FC<
  & React.ComponentPropsWithRef<"nav">
  & React.PropsWithChildren<{
    asChild?: boolean;
  }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : "nav";
  return (
    <Comp
      ref={ref}
      data-slot="scaffold-nav"
      className={cn("order-first sticky z-10 w-full", className)}
      {...props}
    />
  );
};
ScaffoldNav.displayName = "ScaffoldNav";

// ScaffoldHeader
export const ScaffoldHeader: React.FC<
  & React.ComponentPropsWithRef<"header">
  & React.PropsWithChildren<{
    asChild?: boolean;
  }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : "header";
  return (
    <Comp
      ref={ref}
      data-slot="scaffold-header"
      className={cn("w-full", className)}
      {...props}
    />
  );
};
ScaffoldHeader.displayName = "ScaffoldHeader";

// ScaffoldFooter
export const ScaffoldFooter: React.FC<
  Omit<React.ComponentPropsWithRef<"footer">, "data-slot"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : "footer";
  return (
    <Comp
      ref={ref}
      data-slot="scaffold-footer"
      className={cn(
        "order-last fixed bottom-0 w-full",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldFooter.displayName = "ScaffoldFooter";

// ScaffoldLeading
export const ScaffoldLeading: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="scaffold-leading"
      className={cn(
        "left-0",
        "flex flex-col gap-2 w-fit h-full min-w-xs max-w-sm lg:max-w-md",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldLeading.displayName = "ScaffoldLeading";

// ScaffoldTrailing
export const ScaffoldTrailing: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="scaffold-trailing"
      className={cn(
        "flex flex-col gap-2 w-fit h-full max-w-sm",
        "right-0",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldTrailing.displayName = "ScaffoldTrailing";
