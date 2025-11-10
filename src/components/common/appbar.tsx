// AppBar.tsx
"use client";
// imports
import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

const appBarVariants = cva(
  "flex flex-nowrap items-center gap-2 px-6 py-4 w-full",
  {
    defaultVariants: {
      flavor: "default",
      position: "top",
      size: "default",
      variant: "default",
    },
    variants: {
      flavor: {
        default: "bg-transparent text-foreground border-border",
        accent: "bg-accent text-accent-foreground border-accent/10",
        card: "bg-card text-card-foreground border-card/10",
        primary: "bg-primary text-primary-foreground border-primary/10",
        secondary: "bg-secondary text-secondary-foreground border-secondary/10",
      },
      position: {
        top: "sticky top-0 z-20",
        bottom: "sticky bottom-0 z-20",
      },
      size: {
        default: "h-12",
        sm: "h-9",
        lg: "h-15",
        xl: "h-18",
      },
      variant: {
        default: "border-none",
        outline: "border",
      },
    },
  },
);

// AppBar
export const AppBar: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  } & VariantProps<typeof appBarVariants>
> = ({
  ref,
  className,
  asChild,
  flavor = "default",
  size = "default",
  position = "top",
  variant = "default",
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      data-slot="appbar"
      className={cn(
        appBarVariants({ flavor, position, size, variant }),
        "border-b border-border/50 shadow-inner opacity-90 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
};
AppBar.displayName = "AppBar";

// AppBarContent
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

// AppBarLogo
export const AppBarLogo: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      data-slot="appbar-logo"
      className={cn("h-4 w-4 m-auto border-none ring-none", className)}
      {...props}
    />
  );
};
AppBarLogo.displayName = "AppBarLogo";

export const AppBarTitle: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
    centerTitle?: boolean;
  }
> = ({ ref, className, asChild, centerTitle, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="appbar-title"
      className={cn(
        "font-semibold tracking-tight",
        centerTitle && "absolute left-1/2 transform -translate-x-1/2",
        className,
      )}
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
        "inline-flex flex-nowrap items-center gap-2 lg:gap-4 list-none",
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
        "flex shrink-0 flex-nowrap items-center gap-2 w-fit h-full",
        "order-first left-0",
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
        "flex shrink-0 flex-nowrap items-center gap-2 w-fit h-full",
        "order-last right-0 ml-auto justify-end",
        className,
      )}
      {...props}
    />
  );
};
AppBarTrailing.displayName = "AppBarTrailing";

/** This component is used to render dropdown-menus  */
export const AppBarMenu: React.FC<
  React.ComponentPropsWithRef<"ul"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` if asChild is true
  const Comp = asChild ? Slot : "ul";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-row flex-nowrap shrink gap-2 lg:gap-4 items-center",
        "bg-inherit text-inherit",
        className,
      )}
      {...props}
    />
  );
};
AppBarMenu.displayName = "AppBarMenu";

/** This component is designed to render individual items within the `AppBarMenu` */
export const AppBarMenuItem: React.FC<
  React.ComponentPropsWithRef<"li"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` if asChild is true
  const Comp = asChild ? Slot : "li";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-row flex-1",
        "bg-inherit text-inherit",
        className,
      )}
      {...props}
    />
  );
};
AppBarMenuItem.displayName = "AppBarMenuItem";
