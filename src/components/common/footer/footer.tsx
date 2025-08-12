/**
 * Created At: 2025.08.05:08:32:02
 * @author - @FL03
 * @file - footer.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

// Footer
export const Footer: React.FC<
  React.ComponentPropsWithRef<"footer"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // handle the asChild toggle, using a slot if true
  const Comp = asChild ? Slot : "footer";
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex flex-nowrap items-center gap-2 w-full h-fit px-2 py-1",
        className,
      )}
      {...props}
    />
  );
};
Footer.displayName = "Footer";

// Content
export const FooterContent: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // handle the asChild toggle, using a slot if true
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn("flex flex-col flex-1 gap-2", className)}
      {...props}
    />
  );
};
FooterContent.displayName = "FooterContent";

// Leading
export const FooterLeading: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // handle the asChild toggle, using a slot if true
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-wrap items-center gap-2",
        "left-0 max-w-1/6",
        className,
      )}
      {...props}
    />
  );
};
FooterLeading.displayName = "FooterLeading";

// Trailing
export const FooterTrailing: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // handle the asChild toggle, using a slot if true
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex flex-wrap items-center justify-end gap-2",
        "right-0 max-w-1/6",
        className,
      )}
      {...props}
    />
  );
};
FooterTrailing.displayName = "FooterTrailing";
