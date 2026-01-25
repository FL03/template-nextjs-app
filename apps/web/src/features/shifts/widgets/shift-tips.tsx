/**
 * Created At: 2025.09.14:15:20:57
 * @author - @FL03
 * @file - shift-tips.tsx
 */
"use client";
// imports
import * as React from "react";
import { BanknoteIcon, CreditCardIcon, PiggyBankIcon } from "lucide-react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ShiftData } from "../types";

export const ShiftTipTile: React.FC<
  & React.ComponentPropsWithRef<typeof Item>
  & {
    classNames?: ClassNames<"media" | "value" | "title" | "description">;
    label: string;
    value?: number;
    description?: string;
    showDescription?: boolean;
  }
> = (
  {
    ref,
    children,
    className,
    classNames,
    label,
    description,
    showDescription,
    size = "sm",
    variant = "default",
    value = 0,
    ...props
  },
) => (
  <Item
    ref={ref}
    className={cn("flex-nowrap w-full", className)}
    size={size}
    variant={variant}
    {...props}
  >
    <ItemMedia
      variant="icon"
      className={cn("", classNames?.mediaClassName)}
      hidden={!children}
    >
      {children}
    </ItemMedia>
    <ItemContent>
      <ItemTitle className={cn("font-medium", classNames?.titleClassName)}>
        {label}
      </ItemTitle>
      <ItemDescription
        className={cn(
          "text-sm text-muted-foreground",
          showDescription ? "not-sr-only" : "sr-only",
          classNames?.descriptionClassName,
        )}
      >
        {description}
      </ItemDescription>
    </ItemContent>
    <ItemContent className="ml-auto justify-end">
      <span
        className={cn(
          "font-mono font-semibold text-nowrap",
          classNames?.valueClassName,
        )}
      >
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          currencyDisplay: "symbol",
          currencySign: "standard",
          maximumFractionDigits: 2,
        }).format(value)}
      </span>
    </ItemContent>
  </Item>
);

/** The `ShiftTips` component renders the tips earned for the shift as a list of `TipTiles`. */
export const ShiftTips: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof ItemGroup>,
    "children" | "value" | "defaultValue"
  > & {
    value?: ShiftData;
  }
> = (
  {
    ref,
    className,
    value: { tips_cash = 0, tips_credit = 0 } = {},
    ...props
  },
) => (
  <ItemGroup {...props} ref={ref} className={cn("w-full", className)}>
    <ShiftTipTile
      key="cash"
      label="Cash Tips"
      description="Total cash tips received"
      value={tips_cash}
    >
      <BanknoteIcon className="size-5" />
    </ShiftTipTile>
    <ShiftTipTile
      key="credit"
      label="Card Tips"
      description="Total card tips received"
      value={tips_credit}
    >
      <CreditCardIcon className="size-5" />
    </ShiftTipTile>
    <ItemSeparator />
    <ShiftTipTile
      key="total"
      label="Total Tips"
      description="Total tips received"
      value={tips_cash + tips_credit}
    >
      <PiggyBankIcon className="size-5" />
    </ShiftTipTile>
  </ItemGroup>
);
