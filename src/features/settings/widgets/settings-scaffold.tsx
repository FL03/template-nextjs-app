/**
 * Created At: 2025.07.26:12:50:16
 * @author - @FL03
 * @file - settings-scaffold.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components

export const SettingsScaffold: React.FC<
  React.ComponentPropsWithRef<"div"> & React.PropsWithChildren<{}>
> = ({ ref, children, className, ...props }) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn("flex flex-col flex-1 h-full w-full", className)}
    >
      {children}
    </div>
  );
};
SettingsScaffold.displayName = "SettingsScaffold";

export default SettingsScaffold;
