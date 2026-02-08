/**
 * Created At: 2025.09.15:22:37:01
 * @author - @FL03
 * @directory - src/features/shifts/widgets/charts
 * @file - tooltips.tsx
 */
import * as React from "react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ChartTooltip: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Card>, "title"> & {
    classNames?: ClassNames<
      "action" | "content" | "header" | "description" | "separator" | "title"
    >;
    action?: React.ReactNode;
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
  }
> = (
  {
    ref,
    action,
    children,
    className,
    classNames,
    description,
    title,
    showDescription,
    ...props
  },
) => (
  <Card {...props}>
    <CardContent className="flex-1 h-full w-full px-0">
      <CardHeader
        hidden={!title && !description && !action}
        className={cn("border-b w-full", classNames?.headerClassName)}
      >
        {title && (
          <CardTitle className={cn("text-lg", classNames?.titleClassName)}>
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription
            className={cn(
              classNames?.descriptionClassName,
              showDescription ? "not-sr-only" : "sr-only",
            )}
          >
            {description}
          </CardDescription>
        )}
        {action && (
          <CardAction className={cn(classNames?.actionClassName)}>
            {action}
          </CardAction>
        )}
      </CardHeader>
      {children && (
        <CardFooter
          className={cn(
            "w-full px-2",
            classNames?.contentClassName,
          )}
        >
          {children}
        </CardFooter>
      )}
    </CardContent>
  </Card>
);
ChartTooltip.displayName = "ChartTooltip";

export default ChartTooltip;
