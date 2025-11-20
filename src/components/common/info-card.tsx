/**
 * Created At: 2025.11.19:20:34:16
 * @author - @FL03
 * @directory - src/components/common
 * @file - info-card.tsx
 */
"use client";
// globals
import * as React from "react";
import { InfoIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components

import { Button } from "@/components/ui/button";
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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const InfoItem: React.FC<
  & React.ComponentPropsWithRef<typeof Item>
  & React.PropsWithChildren<{
    icon?: React.ReactNode;
    description?: React.ReactNode;
    title?: React.ReactNode;
    classNames?: ClassNames<
      "icon" | "content" | "description" | "header" | "title" | "triggerIcon"
    >;
  }>
> = (
  {
    ref,
    children,
    className,
    classNames,
    description,
    icon,
    title,
    ...props
  },
) => (
  <Item
    ref={ref}
    className={cn(
      "flex-1 flex-nowrap min-w-xs",
      className,
    )}
    {...props}
  >
    {icon && (
      <ItemMedia variant="icon" className={classNames?.iconClassName}>
        {icon}
      </ItemMedia>
    )}
    <ItemContent className={cn("shrink", classNames?.headerClassName)}>
      <ItemTitle
        className={cn(
          "text-nowrap truncate line-clamp-1",
          classNames?.titleClassName,
        )}
      >
        {title}
      </ItemTitle>
      <ItemDescription
        className={cn(
          "truncate line-clamp-1 sr-only md:not-sr-only",
          classNames?.descriptionClassName,
        )}
      >
        {description}
      </ItemDescription>
    </ItemContent>
    {children && (
      <ItemContent
        className={cn(
          "flex-1 justify-end font-semibold",
          classNames?.contentClassName,
        )}
      >
        {children}
      </ItemContent>
    )}
    <ItemActions className="md:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost">
            <InfoIcon
              className={cn("size-4", classNames?.triggerIconClassName)}
            />
            <span className="sr-only">{title}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent hidden={!description}>
          {description}
        </PopoverContent>
      </Popover>
    </ItemActions>
  </Item>
);

InfoItem.displayName = "InfoItem";

export const InfoCard: React.FC<
  & React.ComponentPropsWithRef<typeof Card>
  & React.PropsWithChildren<{
    description?: React.ReactNode;
    title?: React.ReactNode;
    classNames?: ClassNames<
      "action" | "content" | "description" | "header" | "title" | "triggerIcon"
    >;
  }>
> = (
  {
    ref,
    children,
    className,
    classNames,
    description,
    title,
    ...props
  },
) => {
  const ActionPop = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <InfoIcon
            className={cn("size-4", classNames?.triggerIconClassName)}
          />
          <span className="sr-only">{title}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent hidden={!description}>
        {description}
      </PopoverContent>
    </Popover>
  );
  // render the card
  return (
    <Card
      ref={ref}
      className={cn(
        "flex flex-1 items-center min-w-xs h-full w-full",
        className,
      )}
      {...props}
    >
      <CardContent className="flex-1 h-full w-full">
        <CardHeader className={classNames?.headerClassName}>
          <CardTitle
            className={cn(
              "text-nowrap truncate line-clamp-1",
              classNames?.titleClassName,
            )}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={cn(
              "truncate line-clamp-1 sr-only md:not-sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </CardDescription>
          <CardAction className="md:hidden">
            <ActionPop />
          </CardAction>
        </CardHeader>
        <CardFooter
          className={cn(
            "flex flex-1 items-center justify-center h-full w-full",
            "font-semibold",
            classNames?.contentClassName,
          )}
          hidden={!children}
        >
          {children}
        </CardFooter>
      </CardContent>
    </Card>
  );
};
InfoCard.displayName = "InfoCard";
