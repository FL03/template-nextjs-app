/**
 * Created At: 2025.09.15:20:57:27
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - payment-link.tsx
 */
"use client";
// imports
import * as React from "react";
import Link from "next/link";
// components
import { Button } from "@/components/ui/button";

interface PaymentLinkProps
  extends Omit<React.ComponentPropsWithRef<typeof Button>, "children"> {
  label?: string;
  icon?: React.ReactNode;
  paymentLinkId?: string;
}

export const StripePaymentLink: React.FC<PaymentLinkProps> = (
  {
    ref,
    icon,
    label = "Subscribe",
    paymentLinkId = "28E00kdSb6MPcaD0w3aAw07",
    size = "default",
    variant = "default",
    ...props
  },
) => (
  <Button
    asChild
    ref={ref}
    size={size}
    variant={variant}
    {...props}
  >
    <Link
      href={new URL(paymentLinkId, "https://buy.stripe.com")}
      target="_blank"
      rel="noreferrer"
    >
      {icon}
      {label && (
        <span className={size === "icon" ? "sr-only" : "not-sr-only"}>
          {label}
        </span>
      )}
    </Link>
  </Button>
);
StripePaymentLink.displayName = "StripePaymentLink";

export default StripePaymentLink;
