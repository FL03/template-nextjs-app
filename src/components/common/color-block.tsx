/**
 * Created At: 2025.07.27:12:49:14
 * @author - @FL03
 * @file - color-block.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";

/** The `ColorBlock` is a simple, childless component useful as an icon for displaying various colors. */
export const ColorBlock: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {}
> = ({ ref, className, ...props }) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "h-8 w-8 rounded-xl bg-blue-500 border border-blue-600",
        className,
      )}
    />
  );
};
ColorBlock.displayName = "ColorBlock";

export default ColorBlock;
