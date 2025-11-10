/**
 * Created At: 2025.09.14:17:35:19
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - checkout-button.tsx
 */
"use client";
// imports
import * as React from "react";
import { ExpressCheckoutElement } from "@stripe/react-stripe-js";
import { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
// project
import { logger } from "@/lib/logger";

type CheckoutButtonProps = {
  buttonHeight?: number;
};

export const ExpressCheckoutButton: React.FC<CheckoutButtonProps> = (
  { buttonHeight = 40 },
) => {
  if (buttonHeight < 40 || buttonHeight > 55) {
    throw new Error("The `buttonHeight` must be between 40 and 55");
  }
  function handleOnConfirm(
    payload: StripeExpressCheckoutElementConfirmEvent,
  ) {
    logger.trace(JSON.stringify(payload));
  }
  return (
    <ExpressCheckoutElement
      onConfirm={handleOnConfirm}
      options={{
        buttonHeight,
        buttonTheme: {
          applePay: "white",
          googlePay: "white",
          paypal: "white",
        },
        buttonType: {
          applePay: "buy",
          googlePay: "buy",
          paypal: "pay",
        },
      }}
    />
  );
};
