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

/** The `Hero` component */
export const Hero: React.FC<
  & React.ComponentPropsWithRef<"div">
  & React.PropsWithChildren<{
    asChild?: boolean;
  }>
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
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
  & React.ComponentPropsWithRef<"div">
  & React.PropsWithChildren<{
    asChild?: boolean;
  }>
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
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

// HeroFooter
export const HeroFooter: React.FC<
  & React.ComponentPropsWithRef<"div">
  & React.PropsWithChildren<{
    asChild?: boolean;
  }>
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="hero-footer"
      className={cn(
        "order-last flex flex-nowrap items-center w-full gap-2 lg:gap-4 py-2",
        className,
      )}
    />
  );
};
HeroFooter.displayName = "HeroFooter";

// HeroContent
export const HeroContent: React.FC<
  & React.ComponentPropsWithRef<"div">
  & React.PropsWithChildren<{
    asChild?: boolean;
  }>
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
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
  & React.ComponentPropsWithRef<"div">
  & React.PropsWithChildren<{
    asChild?: boolean;
  }>
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
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
  & React.ComponentPropsWithRef<"div">
  & React.PropsWithChildren<
    {
      asChild?: boolean;
    }
  >
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="hero-trailing"
      className={cn(
        "flex shrink items-center justify-end h-full w-auto gap-2",
        "right-0 ml-auto order-last",
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
  }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="hero-description"
      className={cn(
        "text-sm text-muted-foreground leading-none tracking-tight truncate line-clamp-2",
        hidden ? "sr-only" : "not-sr-only",
        className,
      )}
    />
  );
};
HeroDescription.displayName = "HeroDescription";

// HeroTitle
export const HeroTitle: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="hero-title"
      className={cn(
        "text-xl font-semibold leading-none tracking-tight",
        hidden ? "sr-only" : "not-sr-only",
        className,
      )}
    />
  );
};
HeroTitle.displayName = "HeroTitle";
