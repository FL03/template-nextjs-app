/**
 * Created At: 2025.07.25:09:10:04
 * @author - @FL03
 * @file - prose-wrapper.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

/**
 * The `ProseWrapper` component is a generic wrapper for using the `@tailwindcss/typography` plugin.
 * It applies typography styles to its children, making it suitable for displaying rich text content.
 */
export const ProseWrapper: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // use a `Slot` if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "prose",
        "prose-headings:text-foreground",
        "prose-headings:tracking-tight prose-headings:leading-relaxed",
        className,
      )}
    />
  );
};
ProseWrapper.displayName = "ProseWrapper";

export default ProseWrapper;
