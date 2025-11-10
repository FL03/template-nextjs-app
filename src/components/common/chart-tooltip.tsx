/**
 * Created At: 2025.09.15:22:37:01
 * @author - @FL03
 * @directory - src/features/shifts/widgets/charts
 * @file - tooltips.tsx
 */
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const ChartTooltip: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> & {
    classNames?: {
      contentClassName?: string;
      descriptionClassName?: string;
      separatorClassName?: string;
      titleClassName?: string;
    };
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    withSeparator?: boolean;
  }
> = (
  {
    children,
    description,
    title,
    classNames = {},
    showDescription,
    withSeparator,
    ...props
  },
) => (
  <Card {...props}>
    <CardHeader>
      {title && (
        <CardTitle className={classNames.titleClassName}>{title}</CardTitle>
      )}
      {description && (
        <CardDescription
          className={cn(
            classNames.descriptionClassName,
            showDescription ? "not-sr-only" : "sr-only",
          )}
        >
          {description}
        </CardDescription>
      )}
    </CardHeader>
    {withSeparator && (
      <Separator
        className={cn("text-muted-foreground", classNames.separatorClassName)}
      />
    )}
    <CardContent className={cn(classNames.contentClassName)}>
      {children}
    </CardContent>
  </Card>
);
ChartTooltip.displayName = "ChartTooltip";

export default ChartTooltip;
