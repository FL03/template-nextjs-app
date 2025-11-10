/**
 * Created At: 2025.07.06:17:12:19
 * @author - @FL03
 * @file - Hero.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
import { TextSize } from "@/types";

/** The `Hero` component */
export const Hero: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "data-slot" | "title">
  & React.PropsWithChildren<{ asChild?: boolean }>
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
      data-slot="hero"
      className={cn(
        "relative z-auto flex col items-center w-full gap-2 lg:gap-4 py-2",
        className,
      )}
    />
  );
};
Hero.displayName = "Hero";

// HeroHeader
export const HeroHeader: React.FC<
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
      data-slot="hero-content"
      className={cn(
        "flex flex-1 flex-col w-full py-6",
        className,
      )}
    />
  );
};
HeroHeader.displayName = "HeroHeader";

// HeroHeader
export const HeroFooter: React.FC<
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
      data-slot="hero-footer"
      className={cn(
        "flex flex-nowrap items-center w-full gap-2 lg:gap-4 py-2",
        className,
      )}
    />
  );
};
HeroFooter.displayName = "HeroFooter";

// HeroContent
export const HeroContent: React.FC<
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
      data-slot="hero-content"
      className={cn(
        "flex flex-1 flex-col w-full",
        className,
      )}
    />
  );
};
HeroContent.displayName = "HeroContent";

// HeroLeading
export const HeroLeading: React.FC<
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
  // if asChild, render with the Slot; otherwise, render a div
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="hero-leading"
      className={cn(
        "flex shrink-0 items-center w-fit h-full gap-2",
        "left-0 order-first",
        className,
      )}
    />
  );
};
HeroLeading.displayName = "HeroLeading";

// HeroTrailing
export const HeroTrailing: React.FC<
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
      data-slot="hero-trailing"
      className={cn(
        "flex shrink-0 items-center w-fit h-full gap-2",
        "right-0 ml-auto order-last justify-end",
        className,
      )}
    />
  );
};
HeroTrailing.displayName = "HeroTrailing";

// HeroDescription
export const HeroDescription: React.FC<
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
      data-slot="hero-description"
      className={cn(
        "text-muted-foreground",
        hidden ? "sr-only" : "not-sr-only",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
HeroDescription.displayName = "HeroDescription";

// HeroTitle
export const HeroTitle: React.FC<
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
      data-slot="hero-title"
      className={cn(
        "font-semibold leading-none tracking-tight",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
HeroTitle.displayName = "HeroTitle";
