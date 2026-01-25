/**
 * Created At: 2025.09.19:08:23:37
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - checkout-action.tsx
 */
"use client";
// imports
import * as React from "react";
// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * The `CheckoutAction` component renders an action for initializing a new checkout session for some product
 * with the given priceId.
 */
export const CustomCheckoutAction: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Button>, "children" | "type"> & {
    label?: string;
    priceId?: string;
    lookupKey?: string;
  }
> = ({
  disabled,
  label = "Subscribe",
  lookupKey,
  priceId,
  size = "default",
  variant = "default",
  ...props
}) => {
  const formData = {
    priceId,
    lookupKey,
  };
  return (
    <form action="/api/stripe/checkout" method="POST">
      {Object.entries(formData).map(([key, value]) => (
        <Input type="hidden" key={key} name={key} value={value} />
      ))}
      <Button
        disabled={disabled || !(Boolean(priceId) || Boolean(lookupKey))}
        type="submit"
        size={size}
        variant={variant}
        {...props}
      >
        <span className={size === "icon" ? "sr-only" : "not-sr-only"}>
          {label}
        </span>
      </Button>
    </form>
  );
};
CustomCheckoutAction.displayName = "CustomCheckoutAction";

export default CustomCheckoutAction;
