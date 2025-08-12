/**
 * Created At: 2025.08.05:19:38:12
 * @author - @FL03
 * @file - landing-scaffold.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";

export const LandingScaffold: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & {
    asChild?: boolean;
  }
> = ({ ref, children, className, ...props }) => {
  // render the component
  return (
    <div
      {...props}
      ref={ref}
      className={cn("relative z-auto flex flex-1 flex-col h-full w-full", className)}
    >
      {/* main content area */}
      <div className="container mx-auto flex-1 h-full w-full p-4">
        {children}
      </div>
    </div>
  );
};
LandingScaffold.displayName = "LandingScaffold";

export default LandingScaffold;
