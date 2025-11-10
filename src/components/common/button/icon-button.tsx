/**
 * Created At: 2025.07.26:13:48:39
 * @author - @FL03
 * @file - icon-button.tsx
 */
"use client";
// imports
import * as React from "react";
import { Trash2Icon, XIcon } from "lucide-react";
// project
import { cn } from "@/lib/utils";
import { ClassNames } from "@/types";
// components
import { Button } from "@/components/ui/button";

/** The `IconButton` component is a wrapper around the `Button` component outfitted with an optional label. */
export const IconButton: React.FC<
  React.ComponentPropsWithRef<typeof Button> & {
    label?: React.ReactNode;
    classNames?: ClassNames<"label">;
    reverse?: boolean;
  }
> = ({
  ref,
  children,
  className,
  label,
  classNames,
  size = "default",
  reverse,
  ...props
}) => (
  <Button
    ref={ref}
    className={cn(reverse && "flex-row-reverse", className)}
    size={size}
    {...props}
  >
    {children}
    {label && (
      <span
        className={cn(
          "text-nowrap truncate",
          size?.startsWith("icon") ? "sr-only" : "not-sr-only",
          classNames?.labelClassName,
        )}
      >
        {label}
      </span>
    )}
  </Button>
);

export const XIconButton: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof IconButton>, "children"> & {
    classNames?: { iconClassName?: string; labelClassName?: string };
  }
> = ({ classNames: { iconClassName, labelClassName } = {}, ...props }) => (
  <IconButton
    classNames={{ labelClassName }}
    {...props}
  >
    <XIcon className={cn("size-4", iconClassName)} />
  </IconButton>
);

export const TrashIconButton: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof IconButton>, "children"> & {
    classNames?: { iconClassName?: string; labelClassName?: string };
  }
> = ({ classNames: { iconClassName, labelClassName } = {}, ...props }) => (
  <IconButton
    classNames={{ labelClassName }}
    {...props}
  >
    <Trash2Icon className={cn("size-4", iconClassName)} />
  </IconButton>
);
