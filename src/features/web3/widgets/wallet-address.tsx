/**
 * Created At: 2025.07.28:07:25:34
 * @author - @FL03
 * @file - wallet-address.tsx
 */
"use client";
// imports
import * as React from "react";
import { useAccount, useEnsName } from "wagmi";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { formatWeb3Address } from "@/lib/web3";
import { TextSize } from "@/types";

export const WalletAddress: React.FC<
  Omit<React.ComponentPropsWithRef<"span">, "children" | "title"> & {
    fallback?: string;
    showAddress?: boolean;
    size?: TextSize;
  }
> = (
  { ref, className, showAddress, fallback = "", size = "base", ...props },
) => {
  // get a reference to the current account
  const { address } = useAccount();
  // get the ENS name for the address
  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // mainnet
  });
  // memoize the wallet address and the (optional) ens name, resolving it accordingly
  const walletAddress = React.useMemo((): string | null => {
    // if ENS name is available, use it
    if (ensName && !showAddress) {
      return ensName;
    }
    // otherwise, format and return the address
    return address ? formatWeb3Address(address) : null;
  }, [address, ensName, showAddress]);
  // handle the case where no wallet is connected
  if (!address) {
    // log a warning
    logger.warn(
      "No wallet detected; please connect your wallet before trying again.",
    );
    // return null
    return null;
  }

  // render the component
  return (
    <span
      {...props}
      ref={ref}
      className={cn("text-nowrap", size && `text-${size}`, className)}
    >
      {walletAddress ?? fallback}
    </span>
  );
};
WalletAddress.displayName = "WalletAddress";

export default WalletAddress;
