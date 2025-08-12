// toolbar.tsx
"use client";
// imports
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LRTB, TextSize } from "@/types";
// local
import { useToolbar } from "./toolbar-provider";

export const toolbarVariants = cva(
  "",
  {
    defaultVariants: {
      flavor: "default",
      variant: "default",
    },
    variants: {
      flavor: {
        default: "bg-background text-foreground border-none",
        accent: "bg-accent text-accent-foreground border-accent/10",
        primary: "bg-primary text-primary-foreground border-primary/10",
        secondary: "bg-secondary text-secondary-foreground border-secondary/10",
        ghost: "bg-ghost text-ghost-foreground border-none",
        outline: "bg-transparent text-foreground border-muted",
      },
      variant: {
        default: "",
        centered: "container mx-auto rounded-full -translate-y-1/4 max-w-[90%]",
      },
    },
  },
);

/** A type alias for the variants of the `Toolbar` component */
export type ToolbarVariants = VariantProps<typeof toolbarVariants>;

// Toolbar
export const Toolbar: React.FC<
  & React.ComponentPropsWithRef<"div">
  & ToolbarVariants
  & {
    asChild?: boolean;
    side?: LRTB;
  }
> = ({
  ref,
  className,
  asChild,
  flavor = "default",
  side = "bottom",
  variant = "default",
  ...props
}) => {
  // determine if the toolbar is in a mobile view
  const isMobile = useIsMobile();
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // returns true if the toolbar should be vertical
  const isVertical = ["left", "right"].includes(side) && !isMobile;
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        toolbarVariants({ flavor, variant }),
        "flex flex-nowrap items-center gap-2 px-2 py-1 relative z-auto",
        isVertical ? "flex-col h-full w-12" : "flex-row h-12 w-full",
        side && `sticky ${side}-0`,
        className,
      )}
      {...props}
    />
  );
};
Toolbar.displayName = "Toolbar";

// Toolbar Action
export const ToolbarAction: React.FC<
  React.ComponentPropsWithRef<"li"> & ToolbarVariants & { asChild?: boolean }
> = ({ ref, className, asChild, variant, ...props }) => {
  // render as a `Slot` if the asChild property is true
  const Comp = asChild ? Slot : "li";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("text-center hover:italic transition-colors", className)}
      {...props}
    />
  );
};
ToolbarAction.displayName = "ToolbarAction";

// Toolbar Action
export const ToolbarActionGroup: React.FC<
  React.ComponentPropsWithRef<"ul"> & ToolbarVariants & { asChild?: boolean }
> = ({ ref, className, asChild, variant, ...props }) => {
  // render as a `Slot` if the asChild property is true
  const Comp = asChild ? Slot : "ul";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("inline-flex flex-row flex-nowrap", className)}
      {...props}
    />
  );
};
ToolbarActionGroup.displayName = "ToolbarActionGroup";

// Toolbar Section
export const ToolbarContent: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render as a `Slot` if the asChild property is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-1 flex-nowrap items-center gap-2",
        className,
      )}
      {...props}
    />
  );
};
ToolbarContent.displayName = "ToolbarContent";

// Toolbar Section
export const ToolbarLeading: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render as a `Slot` if the asChild property is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-nowrap items-center gap-2",
        "left-0 max-w-1/3",
        className,
      )}
      {...props}
    />
  );
};
ToolbarLeading.displayName = "ToolbarLeading";

// Toolbar Section
export const ToolbarTrailing: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // render as a `Slot` if the asChild property is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-nowrap items-center gap-2",
        "right-0 max-w-1/3 justify-end ml-auto",
        className,
      )}
      {...props}
    />
  );
};
ToolbarTrailing.displayName = "ToolbarTrailing";

export const ToolbarTitle: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, textSize = "base", asChild, ...props }) => {
  // use the context to determine if the title should be centered
  const { centerTitle } = useToolbar();
  // render as a `Slot` if the asChild property is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "leading-none font-semibold text-foreground",
        centerTitle && "absolute left-1/2 transform -translate-x-1/2",
        textSize && `text-${textSize}`,
        className,
      )}
      {...props}
    />
  );
};
ToolbarTitle.displayName = "ToolbarTitle";

export const ToolbarDescription: React.FC<
  React.ComponentPropsWithRef<"span"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, textSize = "base", asChild, ...props }) => {
  // render as a `Slot` if the asChild property is true
  const Comp = asChild ? Slot : "span";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-muted-foreground",
        textSize && `text-${textSize}`,
        className,
      )}
      {...props}
    />
  );
};
ToolbarDescription.displayName = "ToolbarDescription";

export const ToolbarInput: React.FC<
  React.ComponentPropsWithRef<"input"> & {
    placeholder?: string;
    asChild?: boolean;
  }
> = ({ ref, className, placeholder = "Search...", asChild, ...props }) => {
  // render the component as a slot if asChild is true
  const Comp = asChild ? Slot : "input";
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "bg-primary-foreground text-primary rounded-md transition-colors",
        "h-fit max-w-xs my-auto px-2 py-1",
        "hover:bg-blend-color hover:ring hover:ring-muted",
        className,
      )}
      placeholder={placeholder}
    />
  );
};
ToolbarInput.displayName = "ToolbarInput";
