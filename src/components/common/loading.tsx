/**
 * Created At: 2025.10.24:17:23:44
 * @author - @FL03
 * @directory - src/components/common
 * @file - loading.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
import { ClassNames } from "@/types";
// components
import { Spinner } from "@/components/ui/spinner";

export const LoadingIndicator: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {
    showLabel?: boolean;
    classNames?: ClassNames<"icon" | "label">;
  }
> = ({ ref, className, classNames, showLabel, ...props }) => (
  <div
    ref={ref}
    data-slot="loading"
    className={cn("inline-flex flex-nowrap gap-2 items-center", className)}
    {...props}
  >
    <Spinner className={cn("size-5", classNames?.iconClassName)} />
    <span
      className={cn(
        "animate-pulse font-semibold transition-colors ease-in-out duration-200",
        showLabel ? "not-sr-only" : "sr-only",
        classNames?.labelClassName,
      )}
    >
      Loading
    </span>
  </div>
);
