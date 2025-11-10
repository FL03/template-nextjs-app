/**
 * Created At: 2025.10.09:14:50:04
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - product-table.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useStripeProduct } from "@/hooks/use-product";
import { cn } from "@/lib/utils";
// local
import { ProductPrice } from "./price-card";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


/** The `PriceCard` component renders an actionable product item using a payment link id to engage the `stripe` api. */
export const ProductTable: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Card>, "title" | "children"> & {
    priceId?: string;
    lookupKey?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    showDescription?: boolean;
    classNames?: {
      descriptionClassName?: string;
      titleClassName?: string;
      actionClassName?: string;
      contentClassName?: string;
      headerClassName?: string;
      footerClassName?: string;
    };
  }
> = (
  {
    className,
    lookupKey = "pzzld_org_tips_monthly",
    priceId: productId,
    showDescription,
    classNames = {},
    description =
      "A tip tracker equipped with various analytical tools to help you manage your tips and earnings.",
    title = "Tip Tracker",
    ...props
  },
) => {
  const { data, prices } = useStripeProduct({ productId });
  return (
    <Card
      className={cn(
        "flex flex-1 flex-col w-full gap-2 max-w-sm relative z-auto",
        className,
      )}
      {...props}
    >
      <CardHeader className={classNames?.headerClassName}>
        <CardTitle
          className={cn("text-2xl text-nowrap", classNames?.titleClassName)}
        >
          {title}
        </CardTitle>
        {description && (
          <CardDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          "flex-1 h-full w-full",
          classNames?.contentClassName,
        )}
      >
        <ul className="flex flex-1 flex-nowrap gap-4 lg:gap-6 h-full w-full">
          {prices?.map(({ id, currency, recurring, unit_amount }) => {
            const cost = unit_amount ? unit_amount / 1000 : 0;
            return (
              <ProductPrice
                key={id}
                id={id}
                cost={cost}
                interval={recurring?.interval}
                currency={currency}
              />
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};
ProductTable.displayName = "PriceCard";
