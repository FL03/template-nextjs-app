/**
 * Created At: 2025.09.19:09:04:18
 * @author - @FL03
 * @directory - src/features/billing/views
 * @file - checkout-page.tsx
 */
"use client";
// imports
import * as React from "react";
// local
import { PriceCard } from "../widgets";
// components
import { DetailScaffold } from "@/components/common/details";

export const CheckoutPage: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DetailScaffold>, "children">
> = (
  {
    title = "Pricing",
    ...props
  },
) => {
  const productDescription = () => (
    <ul className="flex flex-col list-disc list-inside pt-2">
      <li>
        Maintain a personal ledger of tips received
      </li>
      <li>
        Create and manage your active organizations to enable the grouping of
        tips and earnings!
      </li>
      <li>
        Quickly view your earning and analyze your performance with detailed
        reports, visuals, and more!
      </li>
    </ul>
  );
  return (
    <DetailScaffold title={title} {...props}>
      <ul className="flex flex-1 flex-wrap w-full items-center justify-center gap-4 lg:gap-6">
        <li key="monthly">
          <PriceCard lookupKey="pzzld_org_tips_monthly">
            {productDescription()}
          </PriceCard>
        </li>
        <li key="yearly">
          <PriceCard lookupKey="pzzld_org_tips_yearly">
            {productDescription()}
          </PriceCard>
        </li>
      </ul>
    </DetailScaffold>
  );
};
CheckoutPage.displayName = "CheckoutPage";

export default CheckoutPage;
