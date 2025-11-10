/**
 * Created At: 2025.09.14:19:46:08
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - checkout-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import { ElementsConsumer, PaymentElement } from "@stripe/react-stripe-js";
// components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// InternalForm
class CheckoutFormInternal extends React.Component<
  { stripe?: Stripe | null; elements?: StripeElements | null }
> {
  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const { stripe, elements } = this.props;

    if (elements == null) {
      return;
    }
    if (stripe == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      return;
    }

    // Create the PaymentIntent and obtain clientSecret
    const res = await fetch("/create-intent", {
      method: "POST",
    });

    const { client_secret: clientSecret } = await res.json();

    const returnUrl = new URL("/checkout", window.location.origin);
    returnUrl.searchParams.set("status", "success");

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: returnUrl.toString(),
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  render() {
    const { stripe } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <Card className="flex flex-1 flex-col w-full">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              Complete your purchase by providing your payment details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentElement options={{ layout: "accordion" }} />
          </CardContent>
          <CardFooter className="flex flex-1 flex-nowrap items-center justify-end w-full gap-4 lg:gap-6">
            <Button type="submit" disabled={!stripe} className="w-full">
              Pay
            </Button>
          </CardFooter>
        </Card>
      </form>
    );
  }
}
/**
 * The `CheckoutForm` component renders the injected form wrapped in an `ElementsConsumer` instance to provide the necessary Stripe context.
 */
export const CheckoutForm: React.FC = () => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <CheckoutFormInternal stripe={stripe} elements={elements} />
    )}
  </ElementsConsumer>
);
CheckoutForm.displayName = "CheckoutForm";

export default CheckoutForm;
