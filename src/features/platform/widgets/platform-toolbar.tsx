/**
 * Created At: 2025.07.28:09:08:36
 * @author - @FL03
 * @file - platform-toolbar.tsx
 */
"use client";
// imports
import * as React from "react";
// components
import {
  Toolbar,
  ToolbarContent,
  ToolbarTrailing,
} from "@/components/common/toolbar";
import { Clock } from "@/components/common/clock";

export const PlatformToolbar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Toolbar>, "asChild" | "children" | "side">
> = ({ ref, className, ...props }) => {
  // render the PlatformToolbar component
  return (
    <Toolbar
      {...props}
      ref={ref}
      className={className}
      side="bottom"
    >
      <ToolbarContent>
        {/* Toolbar content can be added here */}
      </ToolbarContent>
      <ToolbarTrailing>
        <Clock />
      </ToolbarTrailing>
    </Toolbar>
  );
};
