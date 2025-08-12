/**
 * Created At: 2025-04-12:17:41:53
 * @author - @FL03
 * @file - section.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
// project
import { cn } from "@/lib/utils";
// components
import { Skeleton } from "@/components/ui/skeleton";
import { TextSize } from "@/types";

const sectionVariants = cva("flex px-4 py-2 gap-2 lg:gap-4 rounded-xl", {
  defaultVariants: {
    flavor: "default",
    size: "default",
    variant: "default",
  },
  variants: {
    flavor: {
      default: "bg-background text-foreground border-muted",
      accent: "bg-accent text-accent-foreground border-accent/10",
      primary: "bg-primary text-primary-foreground border-primary/10",
      secondary: "bg-secondary text-secondary-foreground border-secondary/10",
      destructive:
        "bg-destructive text-destructive-foreground border-destructive/10",
      ghost: "bg-transparent text-foreground border-none",
    },
    size: {
      default: "flex-1 w-full",
      compact: "flex-shrink-0 h-fit w-fit",
      full: "flex-1 h-full w-full",
      wide: "w-full",
    },
    variant: {
      default: "flex-col",
      inline: "flex-row flex-nowrap items-center",
      container: "flex-col container mx-auto",
    },
  },
});

type SectionVariants = VariantProps<typeof sectionVariants>;

/**
 * The `Section` component is a flexible container that can be used to group related content together. While the overall effect is similar to a `Card` component,
 * sections are typically used to group other content together needing a more flexible layout empowered with
 */
export const Section: React.FC<
  & Omit<React.ComponentPropsWithRef<"section">, "size" | "title">
  & SectionVariants
  & { asChild?: boolean }
> = ({
  ref,
  className,
  asChild,
  flavor = "default",
  size = "default",
  variant = "default",
  ...props
}) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : "section";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        sectionVariants({ flavor, size, variant }),
        "transition-all duration-200 ease-in-out",
        "",
        className,
      )}
      {...props}
    />
  );
};
Section.displayName = "Section";

export const SectionContent: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("flex flex-col gap-4 w-full", className)}
      {...props}
    />
  );
};
SectionContent.displayName = "SectionContent";

/** The section header component  */
export const SectionHeader: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean; inline?: boolean }
> = ({ ref, className, asChild, inline, ...props }) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex top-0 w-full gap-2",
        inline && "flex-row flex-nowrap items-start",
        !inline && "flex-col",
        className,
      )}
      {...props}
    />
  );
};
SectionHeader.displayName = "SectionHeader";

export const SectionFooter: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "bottom-0 w-full flex flex-row flex-nowrap gap-2 items-center",
        className,
      )}
      {...props}
    />
  );
};
SectionFooter.displayName = "SectionFooter";

export const SectionTitle: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, asChild, className, textSize = "base", ...props }) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        "font-semibold leading-relaxed tracking-tight",
        textSize && `text-${textSize}`,
        className,
      )}
      {...props}
    />
  );
};
SectionTitle.displayName = "SectionTitle";

export const SectionDescription: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, asChild, className, textSize = "sm", ...props }) => {
  // use a slot on asChild in-place of span
  const Comp = asChild ? Slot : "span";
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
};
SectionDescription.displayName = "SectionDescription";

export const SectionSkeleton: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<typeof Section>>
> = ({ ref, children, className, ...props }) => {
  // render the component
  return (
    <Section
      {...props}
      ref={ref}
      className={cn("relative flex flex-1 flex-col w-full", className)}
    >
      <SectionHeader className="flex flex-col gap-2">
        <SectionTitle>
          <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
        </SectionTitle>
        <Skeleton className="h-3 bg-gray-200 rounded w-1/3" />
      </SectionHeader>
      <SectionContent>{children}</SectionContent>
      <SectionFooter>
        <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
        <Skeleton className="h-3 bg-gray-200 rounded w-1/3" />
      </SectionFooter>
    </Section>
  );
};
SectionSkeleton.displayName = "SectionSkeleton";
