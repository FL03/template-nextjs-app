/**
 * Created At: 2025.07.06:17:12:19
 * @author - @FL03
 * @file - header.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
// project
import { cn } from "@/lib/utils";
import { TextSize } from "@/types";

const tileVariants = cva("items-center p-2 gap-1 h-fit", {
  defaultVariants: {
    flavor: "default",
    style: "default",
    variant: "default",
  },
  variants: {
    flavor: {
      default: "border-none",
      accent: "bg-accent text-accent-foreground border-accent/10",
      primary: "bg-primary text-primary-foreground border-primary/10",
      secondary: "bg-secondary text-secondary-foreground border-secondary/10",
    },
    style: {
      default: "rounded-none border border-muted",
      outline: "border rounded-xl shadow-inner drop-shadow-lg",
    },
    variant: {
      default: "flex flex-nowrap w-full",
      inline: "inline-flex flex-nowrap",
      extended: "flex flex-1 flex-wrap w-full",
    },
  },
});

type TileVariants = VariantProps<typeof tileVariants>;

/**
 * The `Tile` flexible container component used to create dynamic, customizable widgets
 */
export const Tile: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "style" | "title">
  & React.PropsWithChildren<{ asChild?: boolean; }>
  & TileVariants
> = ({
  ref,
  className,
  asChild,
  flavor = "default",
  style = "default",
  variant = "default",
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        tileVariants({ flavor, style, variant }),
        className,
      )}
    />
  );
};
Tile.displayName = "Tile";

// TileDescription
export const TileDescription: React.FC<
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
TileDescription.displayName = "TileDescription";

// TileTitle
export const TileTitle: React.FC<
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
TileTitle.displayName = "TileTitle";

/**
 * The `TileContent` component is used to wrap the content of the header; i.e. the title and description. This is primarily used to ensure
 * that the title and description are displayed appropriately within the header layout and enables the header to use a leading and trailing slot.
 */
export const TileContent: React.FC<
  & React.PropsWithChildren<Omit<React.ComponentPropsWithRef<"div">, "title">>
  & {
    asChild?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn("flex flex-1 flex-col w-full", className)}
    />
  );
};
TileContent.displayName = "TileContent";

// TileLeading
export const TileLeading: React.FC<
  & React.PropsWithChildren<Omit<React.ComponentPropsWithRef<"div">, "title">>
  & {
    asChild?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "inline-flex flex-shrink-0 items-center w-fit",
        "left-0",
        className,
      )}
    />
  );
};
TileLeading.displayName = "TileLeading";

// TileTrailing
export const TileTrailing: React.FC<
  & React.PropsWithChildren<Omit<React.ComponentPropsWithRef<"div">, "title">>
  & {
    asChild?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "inline-flex flex-shrink-0 item-center justify-end w-fit",
        "right-0 ml-auto",
        className,
      )}
    />
  );
};
TileTrailing.displayName = "TileTrailing";

export default Tile;
