/**
 * Created At: 2025.08.08:10:34:09
 * @author - @FL03
 * @file - menu-surface.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// imports
import { cn } from "@/lib/utils";

export const StartMenuSurface: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<"div">> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  // use the Slot component whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn("flex flex-col sm:max-w-2/3", className)}
    />
  );
};
StartMenuSurface.displayName = "StartMenuSurface";

