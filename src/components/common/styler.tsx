/**
 * Created At: 2025.11.10:11:46:54
 * @author - @FL03
 * @directory - src/components/common
 * @file - styler.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

export const Styler: React.FC<
  React.ComponentPropsWithRef<"span"> & {
    asChild?: boolean;
    dataFormat?: Intl.NumberFormatOptions["style"];
  }
> = ({ ref, asChild, className, dataFormat = "currency", ...props }) => {
  const Comp = asChild ? Slot : "span";

  function formatValueAs(
    data: number,
    options: Intl.NumberFormatOptions = {
      currency: "USD",
      currencyDisplay: "symbol",
      currencySign: "standard",
      style: dataFormat,
      maximumFractionDigits: 2,
    },
  ) {
    return new Intl.NumberFormat("en-us", options).format(data);
  }

  return <Comp ref={ref} className={cn("", className)} {...props} />;
};
