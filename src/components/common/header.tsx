/**
 * Created At: 2025.07.06:17:12:19
 * @author - @FL03
 * @file - header.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
import { TextSize } from "@/types";

/** The `Header` component */
export const Header: React.FC<
  & Omit<React.ComponentPropsWithRef<"header">, "data-slot" | "title">
  & React.PropsWithChildren<{ asChild?: boolean; vertical?: boolean }>
> = ({
  ref,
  className,
  asChild,
  vertical,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "header";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="header"
      className={cn(
        "relative z-auto flex shrink-0 items-center w-full gap-2 lg:gap-4 py-2",
        vertical ? "flex-col" : "flex-row flex-nowrap",
        className,
      )}
    />
  );
};
Header.displayName = "Header";

// HeaderContent
export const HeaderContent: React.FC<
  & React.PropsWithChildren<
    Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title">
  >
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
      data-slot="header-content"
      className={cn(
        "flex flex-1 flex-col w-full",
        className,
      )}
    />
  );
};
HeaderContent.displayName = "HeaderContent";

// HeaderLeading
export const HeaderLeading: React.FC<
  & React.PropsWithChildren<
    Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title">
  >
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
      data-slot="header-leading"
      className={cn(
        "inline-flex shrink-0 items-center w-fit gap-2",
        "left-0 order-first",
        className,
      )}
    />
  );
};
HeaderLeading.displayName = "HeaderLeading";

// HeaderTrailing
export const HeaderTrailing: React.FC<
  & React.PropsWithChildren<
    Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title">
  >
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
      data-slot="header-trailing"
      className={cn(
        "inline-flex shrink-0 item-center justify-end w-fit gap-2",
        "right-0 ml-auto order-last",
        className,
      )}
    />
  );
};
HeaderTrailing.displayName = "HeaderTrailing";

// HeaderDescription
export const HeaderDescription: React.FC<
  Omit<React.ComponentPropsWithRef<"span">, "data-slot"> & {
    asChild?: boolean;
    hidden?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, hidden, textSize = "sm", ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="header-description"
      className={cn(
        "text-muted-foreground",
        hidden ? "sr-only" : "not-sr-only",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
HeaderDescription.displayName = "HeaderDescription";

// HeaderTitle
export const HeaderTitle: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, textSize = "lg", ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="header-title"
      className={cn(
        "font-semibold leading-none tracking-tight",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
HeaderTitle.displayName = "HeaderTitle";
