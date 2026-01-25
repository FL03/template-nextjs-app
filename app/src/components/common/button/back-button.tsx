/**
 * 2025-04-02
 * @author: @FL03
 * @file: back-button.tsx
 */
"use client";
// imports
import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClassNames } from "@pzzld/core";
// components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
// local
import { IconButton } from "./icon-button";

export const BackButton: React.FC<
  & Omit<React.ComponentPropsWithRef<typeof IconButton>, "children" | "asChild">
  & {
    description?: React.ReactNode;
    orientation?: "left" | "right";
    classNames?: ClassNames<"icon" | "label">;
  }
> = ({
  ref,
  classNames,
  description = "Return to the previous page",
  orientation = "left",
  label = "Back",
  size = "icon",
  variant = "ghost",
  onClick,
  ...props
}) => {
  // Use the router to navigate back
  const router = useRouter();
  const Icon: React.FC<{ className?: string; size?: number }> = ({
    ...props
  }) => {
    switch (orientation) {
      case "right":
        return <ArrowRightIcon {...props} />;
      default:
        return <ArrowLeftIcon {...props} />;
    }
  };
  // return the back button with a tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            {...props}
            ref={ref}
            label={label}
            size={size}
            variant={variant}
            classNames={{ labelClassName: classNames?.labelClassName }}
            onClick={(event) => {
              // cleanup the event
              event.preventDefault();
              event.stopPropagation();
              // if the onClick prop is provided, call it
              if (onClick) onClick(event);
              // otherwise use the router to go back
              else router.back();
            }}
          >
            <Icon className={cn("size-5", classNames?.iconClassName)} />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
BackButton.displayName = "BackButton";

export default BackButton;
