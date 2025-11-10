/**
 * Created At: 2025.09.15:16:58:00
 * @author - @FL03
 * @directory - src/app/(public)/checkout
 * @file - page.tsx
 */
// imports
import { Metadata } from "next";
import { CheckoutPage } from "@/features/billing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "View the various pricing plans for the software.",
};

export default function Page() {
  return (
    <CheckoutPage
      withBack
      className="container mx-auto flex-1 h-full w-full"
      classNames={{
        contentClassName: "flex flex-1 h-full w-full items-center",
      }}
    />
  );
}
Page.displayName = "PricingPage";
