/**
 * Created At: 2025.09.25:17:43:54
 * @author - @FL03
 * @directory - src/lib/stripe/config
 * @file - products.ts
 */
import { ProductPricingOptions, StripeSubscriptionConfig } from "./types";
export const productConfig = (): StripeSubscriptionConfig => {
  const isDev = process.env.NODE_ENV === "development";
  const ids = (dev: boolean) => {
    if (dev) {
      return {
        accountId: "acct_1S7NwgEyVRqBnIeE",
        productId: "prod_T3VKYVJ13Koz8N",
        pricingTableId: "prctbl_1SBLICEyVRqBnIeE8pIhKryI",
      };
    }

    return {
      accountId: "acct_1QJmATIzcUpdxAib",
      productId: "prod_T7aLoUYrn2jRJ3",
      pricingTableId: "prctbl_1SBLOrIzcUpdxAiblJuCVZQw",
    };
  };

  const monthlyPrice = (dev: boolean): ProductPricingOptions => {
    const basePrice = {
      lookupKey: "pzzld_org_tips_monthly",
      cost: 150,
      isDefaultPrice: true,
    };
    if (dev) {
      return {
        ...basePrice,
        priceId: "price_1S9byjEyVRqBnIeEvgV6LCjz",
        paymentLinkId: "test_6oU6oHfcB26O69jh0u5AQ05",
      };
    }
    return {
      ...basePrice,
      paymentLinkId: "00wdRa4hB9Z11vZfqXaAw06",
      priceId: "price_1SBLALIzcUpdxAibz93LCQzW",
    };
  };

  const yearlyPrice = (dev: boolean): ProductPricingOptions => {
    const basePrice = {
      lookupKey: "pzzld_org_tips_yearly",
      cost: 1000,
    };
    if (dev) {
      return {
        ...basePrice,
        paymentLinkId: "test_8x2dR99Sh5j0apz4dI5AQ06",
        priceId: "price_1SBL0oEyVRqBnIeENLqnoW87",
      };
    }
    return {
      ...basePrice,
      paymentLinkId: "28E00kdSb6MPcaD0w3aAw07",
      priceId: "price_1SBLAKIzcUpdxAibbWm9iSjW",
    };
  };

  return {
    ...ids(isDev),
    name: "Tip Tracker",
    currency: "usd",
    prices: [
      monthlyPrice(isDev),
      yearlyPrice(isDev),
    ],
  };
};
