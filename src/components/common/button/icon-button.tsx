/**
 * Created At: 2025.07.26:13:48:39
 * @author - @FL03
 * @file - icon-button.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";

/**
 * The `LabeedButton` component is a wrapper around the `Button` component outfitted with an optional label.
 */
export const LabeledButton: React.FC<
  React.ComponentPropsWithRef<typeof Button> & {
    label?: React.ReactNode;
    reverse?: boolean;
    showLabel?: boolean;
  }
> = ({
  ref,
  children,
  className,
  label,
  size = "default",
  reverse,
  showLabel,
  ...props
}) => {
  // returns true if the icon should be displayed as an icon only
  const asIcon = React.useMemo(() => {
    return !label || !showLabel || size === "icon";
  }, [label, showLabel]);
  // return the button with a tooltip
  return (
    <Button
      ref={ref}
      className={cn(reverse && "flex-row-reverse", className)}
      size={showLabel ? size : "icon"}
      {...props}
    >
      {children}
      {label && (
        <span
          className={cn(
            "leading-snug tracking-tight",
            asIcon ? "sr-only" : "not-sr-only",
          )}
        >
          {label}
        </span>
      )}
    </Button>
  );
};
LabeledButton.displayName = "LabeledButton";

export default LabeledButton;
