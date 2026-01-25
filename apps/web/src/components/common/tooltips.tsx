/**
 * 2025-04-02
 * @author: @FL03
 * @description: a button component equipped with a tooltip
 * @file: tooltip-button.tsx
 */
"use client";
// imprts
import * as React from "react";
// components
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TooltipScaffold: React.FC<
  & React.ComponentPropsWithRef<typeof TooltipTrigger>
  & React.PropsWithChildren<{ description?: React.ReactNode }>
> = ({
  ref,
  description,
  ...props
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger ref={ref} {...props} />
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const TooltipButton: React.FC<
  & React.ComponentPropsWithRef<typeof Button>
  & React.PropsWithChildren<{ description?: React.ReactNode }>
> = ({
  ref,
  description,
  ...props
}) => (
  <TooltipScaffold asChild description={description}>
    <Button {...props} ref={ref} />
  </TooltipScaffold>
);
TooltipButton.displayName = "TooltipButton";
