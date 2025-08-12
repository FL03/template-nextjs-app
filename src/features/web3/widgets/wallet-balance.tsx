/**
 * Created At: 2025.07.28:07:25:09
 * @author - @FL03
 * @file - wallet-balance.tsx
 */
"use client";
// imports
import * as React from "react";
import { useAccount, useBalance } from "wagmi";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { handleBalance } from "@/lib/web3";

/**
 * The `WalletBalance` widget is a customizable component extending the capabilities of the integrated providers to
 * provider a clear and concise portfolio of the active wallet.
 */
export const WalletBalance: React.FC<
  Omit<React.ComponentPropsWithRef<"span">, "children">
> = ({
  ref,
  className,
  ...props
}) => {
  // access the onchain kit context
  const { address } = useAccount();
  // access the balance of the wallet
  const { data: rawBalance } = useBalance({ address });
  // resolve the balance and memoize it
  const balance = React.useMemo(
    () => {
      // if no balance is available, return null
      if (!rawBalance) {
        return null;
      }
      // destructure the balance to get the value and decimals
      const { decimals, value } = rawBalance;
      // resolve the balance using the handleBalance function
      return handleBalance(value, { decimals });
    },
    [rawBalance],
  );
  // handle the case where no wallet is connected
  if (!rawBalance) {
    // log a warning
    logger.warn("Unable to load wallet balance, no wallet connected.");
    // return null to avoid rendering
    return null;
  }
  // destructure the balance to get the necessary properties
  const { symbol } = rawBalance;
  // render the wallet card
  return (
    <span
      {...props}
      ref={ref}
      className={cn(
        "inline-flex flex-nowrap items-center gap-1 text-foreground text-base text-nowrap",
        "leading-none tracking-tight",
        className,
      )}
    >
      {balance}
      <span className="text-sm text-muted-foreground font-semibold">
        {symbol}
      </span>
    </span>
  );
};
WalletBalance.displayName = "WalletBalance";

export default WalletBalance;
