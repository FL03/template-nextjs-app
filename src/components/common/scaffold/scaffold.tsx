/**
 * Created At: 2025-04-04:16:00:40
 * @author - @FL03
 * @description - Scaffold Component
 * @file - scaffold.tsx
 */
"use client";
// imports
import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

const scaffoldVariants = cva(
  "flex flex-1 flex-col min-h-full w-full relative z-auto",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      flavor: {
        default: "bg-background text-foreground",
      },
      variant: {
        default: "",
      },
    },
  },
);

/** A type alias for the variants of a `Scaffold` component. */
type ScaffoldVariants = VariantProps<typeof scaffoldVariants>;

// Scaffold
export const Scaffold: React.FC<
  & React.ComponentPropsWithRef<"div">
  & ScaffoldVariants
  & React.PropsWithChildren<{ asChild?: boolean }>
> = (
  {
    ref,
    className,
    asChild,
    flavor = "default",
    variant = "default",
    ...props
  },
) => {
  // declare the slot component
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        scaffoldVariants({ flavor, variant }),
        className,
      )}
      {...props}
    />
  );
};
Scaffold.displayName = "Scaffold";

// Scaffold Content
export const ScaffoldContent: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "style">
  & React.PropsWithChildren<{
    asChild?: boolean;
    fullWidth?: boolean;
  }>
> = ({
  ref,
  className,
  asChild,
  fullWidth,
  ...props
}) => {
  // handle asChild
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex flex-1 flex-col h-full w-full gap-2 px-4 py-2",
        !fullWidth && "container mx-auto",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldContent.displayName = "ScaffoldContent";

// Scaffold Nav
export const ScaffoldNav: React.FC<
  React.ComponentPropsWithRef<"nav"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` when asChild
  const Comp = asChild ? Slot : "nav";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("sticky top-0 h-fit w-full order-first z-50", className)}
      {...props}
    />
  );
};
ScaffoldNav.displayName = "ScaffoldNav";

// Scaffold Header Component
export const ScaffoldHeader: React.FC<
  React.ComponentPropsWithRef<"header"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` when asChild
  const Comp = asChild ? Slot : "header";
  // render the component
  return (
    <Comp ref={ref} className={cn("top-1 w-full flex", className)} {...props} />
  );
};
ScaffoldHeader.displayName = "ScaffoldHeader";

// Scaffold Footer
export const ScaffoldFooter: React.FC<
  React.ComponentPropsWithRef<"footer"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` when asChild
  const Comp = asChild ? Slot : "footer";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "bottom-0 flex flex-shrink items-center w-full min-h-1/12 max-h-1/6 order-last",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldFooter.displayName = "ScaffoldFooter";

// Scaffold Leading
export const ScaffoldLeading: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` when asChild
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex flex-1 flex-shrink-0 flex-col gap-2 mr-auto",
        "h-full max-w-sm",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldLeading.displayName = "ScaffoldLeading";

// Scaffold Trailing
export const ScaffoldTrailing: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` when asChild
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "ml-auto h-full max-w-sm flex flex-1 flex-col gap-2",
        className,
      )}
      {...props}
    />
  );
};
ScaffoldTrailing.displayName = "ScaffoldTrailing";
