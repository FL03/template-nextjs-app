/**
 * Created At: 2025.07.26:15:32:43
 * @author - @FL03
 * @file - list-view.tsx
 */
// imports
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

const listVariants = cva("px-2 py-1 w-full", {
  defaultVariants: {
    flavor: "default",
    orientation: "horizontal",
    variant: "default",
  },
  variants: {
    flavor: {
      default: "bg-background text-foreground",
      accent: "bg-accent text-accent-foreground",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
    orientation: {
      vertical: "flex flex-col",
      horizontal: "flex flex-row flex-nowrap items-center",
    },
    variant: {
      default: "flex flex-col gap-2",
      card:
        "flex flex-col gap-2 rounded-xl border border-muted shadow-inner drop-shadow-md",
      grid:
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    },
  },
});

export type ListVariants = VariantProps<typeof listVariants>;

export const OList: React.FC<
  React.ComponentPropsWithRef<"ol"> & ListVariants & { asChild?: boolean }
> = ({
  ref,
  className,
  asChild,
  flavor = "default",
  orientation = "vertical",
  variant = "default",
  ...props
}) => {
  // render the component as a `Slot` if asChild is true
  const Comp = asChild ? Slot : "ol";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(listVariants({ flavor, orientation, variant }), className)}
      {...props}
    />
  );
};
OList.displayName = "OList";

export const UList: React.FC<
  React.ComponentPropsWithRef<"ul"> & ListVariants & { asChild?: boolean }
> = ({
  ref,
  className,
  asChild,
  flavor = "default",
  orientation = "vertical",
  variant = "default",
  ...props
}) => {
  // render the component as a `Slot` if asChild is true
  const Comp = asChild ? Slot : "ul";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(listVariants({ flavor, orientation, variant }), className)}
      {...props}
    />
  );
};
UList.displayName = "UList";

// ListItem
export const ListItem: React.FC<
  & React.ComponentPropsWithRef<"li">
  & { asChild?: boolean; inline?: boolean; expanded?: boolean }
> = ({
  ref,
  className,
  asChild,
  expanded,
  inline,
  ...props
}) => {
  // render the component as a `Slot` if asChild is true
  const Comp = asChild ? Slot : "li";
  // return the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex-nowrap items-center p-2 gap-1 h-fit w-full",
        "duration-200 ease-in-out transition-colors ",
        "hover:backdrop-opacity-75 hover:cursor-pointer",
        "last:rounded-b-lg first:rounded-t-lg",
        inline ? "inline-flex" : "flex",
        expanded ? "flex-1" : "flex-shrink-0",
        className,
      )}
      {...props}
    />
  );
};
ListItem.displayName = "ListItem";
