/**
 * Created At: 2025.10.13:21:05:50
 * @author - @FL03
 * @directory - src/components/common/button
 * @file - save-button.tsx
 */
"use client";
// imports
import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";

/**
 * The `SubmitButton` is a pre-defined submit button for forms, using the `useFormStatus` hook from `react-dom`
 * to determine the state of the button.
 */
export const SubmitButton: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, "children"> & {
    classNames?: ClassNames<"icon" | "label">;
    labels?: Record<"pending" | "default", string>;
    icon?: React.ReactNode;
  }
> = (
  {
    ref,
    icon = <SaveIcon className="size-4" />,
    className,
    classNames,
    labels = { pending: "Submitting...", default: "Submit" },
    disabled,
    size = "default",
    ...props
  },
) => {
  const { pending } = useFormStatus();

  const Icon = () => {
    if (pending) {
      return (
        <Loader2Icon
          className={cn("size-4 animate-spin", classNames?.iconClassName)}
        />
      );
    }
    return icon;
  };
  const Label = (
    { mode = "default" }: { mode: "pending" | "default" },
  ) => (
    <span
      className={cn(
        size?.startsWith("icon") ? "sr-only" : "not-sr-only",
        mode === "pending" && "animate-pulse",
        classNames?.labelClassName,
      )}
    >
      {labels[mode]}
    </span>
  );
  return (
    <Button
      ref={ref}
      size={size}
      disabled={pending || disabled}
      className={cn("w-full", className)}
      {...props}
    >
      <Icon />
      <Label mode={pending ? "pending" : "default"} />
    </Button>
  );
};
SubmitButton.displayName = "SubmitButton";

export const SaveButton: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, "children"> & {
    isSaving?: boolean;
    classNames?: ClassNames<"icon" | "label">;
    labels?: Record<"pending" | "default", string>;
  }
> = (
  {
    ref,
    className,
    classNames,
    disabled,
    isSaving,
    labels = { pending: "Saving...", default: "Save" },
    size = "default",
    ...props
  },
) => {
  const Icon = () => {
    if (isSaving) {
      return (
        <Loader2Icon
          className={cn("size-4 animate-spin", classNames?.iconClassName)}
        />
      );
    }
    return <SaveIcon className={cn("size-4", classNames?.iconClassName)} />;
  };

  const Label = (
    { mode = "default" }: { mode?: "pending" | "default" } = {},
  ) => (
    <span
      className={cn(
        size?.startsWith("icon") ? "sr-only" : "not-sr-only",
        mode === "pending" && "animate-pulse",
        classNames?.labelClassName,
      )}
    >
      {labels[mode]}
    </span>
  );

  return (
    <Button
      ref={ref}
      size={size}
      disabled={isSaving || disabled}
      className={cn("w-full", className)}
      {...props}
    >
      <Icon />
      <Label mode={isSaving ? "pending" : "default"} />
    </Button>
  );
};
SaveButton.displayName = "SaveButton";
