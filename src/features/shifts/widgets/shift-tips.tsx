/**
 * Created At: 2025.09.14:15:20:57
 * @author - @FL03
 * @file - shift-tips.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { formatAsCurrency } from "@/lib/fmt";
import { cn } from "@/lib/utils";
// components
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

export const TipTile: React.FC<
  & Omit<React.ComponentPropsWithoutRef<typeof Item>, "children">
  & {
    label: string;
    value?: number;
    description?: string;
    showDescription?: boolean;
  }
> = (
  {
    className,
    label,
    description,
    showDescription,
    value = 0,
    ...props
  },
) => (
  <Item className={cn("p-2", className)} {...props}>
    <ItemContent>
      <ItemTitle className="font-medium">{label}</ItemTitle>
      <ItemDescription
        className={cn(
          "text-sm text-muted-foreground",
          showDescription ? "not-sr-only" : "sr-only",
        )}
      >
        {description}
      </ItemDescription>
    </ItemContent>
    <ItemFooter>{formatAsCurrency(value)}</ItemFooter>
  </Item>
);

/** The `ShiftTips` component renders the tips earned for the shift as a list of `TipTiles`. */
export const ShiftTips: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof ItemGroup>, "children"> & {
    cashTips?: number;
    cardTips?: number;
    otherTips?: number;
  }
> = (
  {
    className,
    cashTips = 0,
    cardTips = 0,
    otherTips = 0,
    ...props
  },
) => (
  <ItemGroup {...props} className={cn("w-full", className)}>
    <TipTile
      key="cash"
      label="Cash Tips"
      description="Total cash tips received"
      value={cashTips}
    />
    <TipTile
      key="credit"
      label="Card Tips"
      description="Total card tips received"
      value={cardTips}
    />
    <ItemSeparator />
    <TipTile
      key="total"
      label="Total Tips"
      description="Total tips received"
      value={cashTips + cardTips + otherTips}
    />
  </ItemGroup>
);
