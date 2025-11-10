/**
 * Created At: 2025.09.28:10:35:31
 * @author - @FL03
 * @directory - src/features/shifts/widgets
 * @file - stat-card.tsx
 */
"use client";
// globals
import * as React from "react";
import { InfoIcon } from "lucide-react";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// components
import { IconButton } from "@/components/common/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ClassNames } from "@/types";

export const InfoCard: React.FC<
  & React.ComponentPropsWithRef<typeof Card>
  & React.PropsWithChildren<{
    description?: React.ReactNode;
    title?: React.ReactNode;
    compact?: boolean;
    classNames?: ClassNames<"title" | "description" | "content">;
  }>
> = (
  {
    ref,
    children,
    className,
    classNames,
    description,
    title,
    compact,
    ...props
  },
) => {
  const isMobile = useIsMobile();
  // determine whether to show the description
  const showDescription = description && !compact && !isMobile;

  const InfoPop = () => (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton size="icon" variant="ghost" label={title}>
          <InfoIcon className="size-4" />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        {description}
      </PopoverContent>
    </Popover>
  );
  // render the card
  return (
    <Card
      ref={ref}
      className={cn(
        "flex flex-1 items-center min-w-xs h-full",
        compact ? "max-w-sm" : "max-w-md",
        className,
      )}
      {...props}
    >
      <CardContent className="flex-1 h-full w-full">
        <CardHeader>
          <CardTitle
            className={cn(
              "leading-none text-nowrap tracking-tight font-bold",
              classNames?.titleClassName,
            )}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </CardDescription>
          {!showDescription && (
            <CardAction>
              <InfoPop />
            </CardAction>
          )}
        </CardHeader>
        {children && (
          <CardFooter
            className={cn(
              "flex flex-1 items-center justify-center h-full w-full",
              "font-semibold",
              classNames?.contentClassName,
            )}
          >
            {children}
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
};
InfoCard.displayName = "InfoCard";

export default InfoCard;
