// action-group.tsx
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
import { TextSize } from "@/types";

const actionGroupVariants = cva("p-2 gap-2 rounded-xl", {
  defaultVariants: {
    flavor: "default",
    marker: "default",
    size: "default",
    variant: "default",
  },
  variants: {
    flavor: {
      default: "bg-inherit text-foreground border-none",
      accent: "bg-accent text-accent-foreground border-accent/10",
      muted: "bg-muted text-muted-foreground border-muted/10",
      primary: "bg-primary text-primary-foreground border-primary/10",
      secondary: "bg-secondary text-secondary-foreground border-secondary/10",
      destructive:
        "bg-destructive text-destructive-foreground border-destructive/10",
      outline: "bg-transparent text-foreground border-muted",
    },
    marker: {
      default: "list-none",
      disc: "list-disc",
      decimal: "list-decimal",
      square: "list-square",
    },
    size: {
      default: "w-full",
      compact: "h-fit w-fit",
      extended: "flex-1 w-full",
      full: "flex-1 h-full w-full",
    },
    variant: {
      default: "flex flex-nowrap items-center w-full",
      inline: "inline-flex flex-nowrap items-center",
      vertical: "flex flex-col items-start w-full",
      wrap: "flex flex-wrap items-center w-full",
    },
  },
});

/**
 * The `ActionGroup` component is a flexible container for grouping actions, such as buttons or links, in a consistent layout.
 * It supports different orientations (horizontal or vertical) and styles (inline, full, or full width).
 */
export const ActionGroup: React.FC<
  & React.ComponentPropsWithRef<"ul">
  & VariantProps<typeof actionGroupVariants>
  & {
    asChild?: boolean;
  }
> = ({
  ref,
  className,
  flavor = "default",
  marker = "default",
  size = "default",
  variant = "default",
  asChild,
  ...props
}) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "ul";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        actionGroupVariants({
          flavor,
          marker,
          size,
          variant,
        }),
        className,
      )}
    />
  );
};
ActionGroup.displayName = "ActionGroup";

export const ActionGroupItem: React.FC<
  React.ComponentPropsWithRef<"li"> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : "li";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
};
ActionGroupItem.displayName = "ActionGroupItem";

export const ActionGroupLabel: React.FC<
  React.ComponentPropsWithRef<"span"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({
  ref,
  className,
  asChild,
  textSize = "sm",
  ...props
}) => {
  // render as a slot if asChild is true
  const Comp = asChild ? Slot : "span";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "text-muted-foreground leading-snug tracking-tight line-clamp-1",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
ActionGroupLabel.displayName = "ActionGroupLabel";
