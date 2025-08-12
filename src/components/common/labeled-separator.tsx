/**
 * Created At: 2025.08.11:23:33:09
 * @author - @FL03
 * @file - labeled-separator.tsx
 */
"use client";
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import { Separator } from "@/components/ui/separator";

interface WidgetProps {
  separatorClassName?: string;
}

export const LabeledSeparator: React.FC<
  React.ComponentPropsWithoutRef<"div"> & React.PropsWithChildren<WidgetProps>
> = ({ className, children, separatorClassName, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-nowrap w-full items-center justify-center gap-2",
        className,
      )}
      {...props}
    >
      <Separator
        orientation="horizontal"
        className={cn("bg-muted h-px flex-1", separatorClassName)}
      />
      <span className="text-xs text-muted-foreground">{children}</span>
      <Separator
        orientation="horizontal"
        className={cn("bg-muted h-px flex-1", separatorClassName)}
      />
    </div>
  );
};
LabeledSeparator.displayName = "LabeledSeparator";

export default LabeledSeparator;
