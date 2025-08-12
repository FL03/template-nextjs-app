/**
 * Created At: 2025.07.28:10:33:03
 * @author - @FL03
 * @file - loading-scaffold.tsx
 */
"use client";
//imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// imports
import { cn } from "@/lib/utils";

/** The `LoadingScaffold` component is designed to be a wrapper to various loaders to be displayed as an overlay.  */
export const LoadingScaffold: React.FC<
  React.ComponentPropsWithRef<"div"> & { asChild?: boolean }
> = (
  { ref, className, asChild, ...props },
) => {
  // fallback to a slot component if asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-center min-h-dvh w-full relative z-[9999]",
        "backdrop-blur-sm bg-background",
        className,
      )}
    />
  );
};
LoadingScaffold.displayName = "LoadingScaffold";

export default LoadingScaffold;
