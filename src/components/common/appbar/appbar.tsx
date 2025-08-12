// appbar.tsx
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
// local
import { useAppbar } from "./appbar-provider";

/**
 * The `Appbar` component is a flexible and dynamic navigational bar placed at either the very top or bottom of the page.
 */
export const AppBar: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
    position?: "top" | "bottom";
  }
> = ({
  ref,
  className,
  asChild,
  position = "top",
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex flex-nowrap h-fit max-h-1/6 w-full items-center gap-2 px-4 py-2 mb-1 relative z-50",
        "bg-accent text-accent-foreground border border-accent/10 shadow-inner opacity-90",
        position && `sticky ${position}-0`,
        className,
      )}
      data-slot="appbar"
      {...props}
    />
  );
};
AppBar.displayName = "AppBar";

// AppbarContent
export const AppBarContent: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean; centered?: boolean }
> = ({ ref, className, asChild, centered, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex flex-1 flex-nowrap basis-2/3 w-full items-center gap-2",
        "order-2",
        centered && "justify-center",
        className,
      )}
      {...props}
    />
  );
};
AppBarContent.displayName = "AppBarContent";

// AppbarLogo
export const AppBarLogo: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("h-4 w-4 m-auto border-none ring-none", className)}
      {...props}
    />
  );
};
AppBarLogo.displayName = "AppBarLogo";

export const AppBarTitle: React.FC<
  React.ComponentPropsWithRef<"h1"> & {
    asChild?: boolean;
    textSize?: "base" | "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  }
> = ({ ref, className, asChild, textSize, ...props }) => {
  // access the appbar context
  const { centerTitle } = useAppbar();
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "h1";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "font-semibold tracking-tight",
        centerTitle && "absolute left-1/2 transform -translate-x-1/2",
        textSize && `text-${textSize}`,
        className,
      )}
      {...props}
    />
  );
};
AppBarTitle.displayName = "AppBarTitle";

// AppBarActions
export const AppBarActions: React.FC<
  React.ComponentPropsWithRef<"ul"> & { asChild?: boolean }
> = ({ ref, className, asChild = false, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "ul";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex flex-nowrap items-center gap-2 lg:gap-4 list-none",
        className,
      )}
      {...props}
    />
  );
};
AppBarActions.displayName = "AppBarActions";

// AppBarActions
export const AppBarAction: React.FC<
  React.ComponentPropsWithRef<"li"> & { asChild?: boolean }
> = ({ ref, className, asChild = false, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "li";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("inline-flex flex-1 gap-2 items-center", className)}
      {...props}
    />
  );
};
AppBarAction.displayName = "AppBarAction";

// AppBarLeading
export const AppBarLeading: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-nowrap items-center gap-2 order-first",
        "left-0 max-w-1/3 leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
};
AppBarLeading.displayName = "AppBarLeading";

// AppBarTrailing
export const AppBarTrailing: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-nowrap basis-64 items-center gap-2 order-last",
        "right-0 basis-1/6 max-w-1/3 justify-end ml-auto",
        className,
      )}
      {...props}
    />
  );
};
AppBarTrailing.displayName = "AppBarTrailing";
