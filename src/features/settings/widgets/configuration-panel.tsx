/**
 * Created At: 2025.07.27:09:57:57
 * @author - @FL03
 * @file - configuration-panel.tsx
 */
"use client";
//imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import { Title } from "@/components/common/typography";

/**
 * The `ConfigurationPanel` component renders the view for the settings screen;
 */
export const ConfigurationPanel: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title">
> = ({ ref, children, className, ...props }) => {
  // render the configuration panel
  return (
    <div
      {...props}
      ref={ref}
      className={cn("flex flex-col flex-1 h-full w-full", className)}
    >
      <div className="flex flex-col w-full mb-2">
        <Title>Settings</Title>
      </div>
      <div
        className={cn(
          "flex flex-col flex-1 h-full w-full px-4 py-2",
          "inset-0 bg-accent text-accent-foreground rounded-lg drop-shadow-2xl border border-accent/10",
        )}
      >
        {children}
      </div>
    </div>
  );
};
ConfigurationPanel.displayName = "ConfigurationPanel";

export default ConfigurationPanel;
