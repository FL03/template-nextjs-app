/**
 * Created At: 2025.07.28:11:06:48
 * @author - @FL03
 * @file - network-status-badge.tsx
 */
"use client";
// imports
import * as React from "react";
import { injected, useAccount, useConnect } from "wagmi";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// components
import { Badge } from "@/components/ui/badge";

/** A badge displaying the connection status of the platform with a valid web3 wallet. */
export const WalletStatus: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Badge>, "children" | "id"> & {
    showLabel?: boolean;
  }
> = ({ ref, className, showLabel, variant = "outline", ...props }) => {
  // use wagmi's useAccount hook to get the current wallet address
  const { address, chain } = useAccount();
  // use wagmi's useConnect hook to get the connect function and available connectors
  const { connect } = useConnect();
  // returns true if a wallet is connected
  const isConnected = React.useMemo(() => Boolean(address), [address]);
  // handle the case where no wallet is connected
  if (!isConnected) {
    // log a warning
    logger.warn("Please connect your wallet to view the wallet status badge.");
  }
  // handle the onClick event for the badge
  async function handleOnClick() {
    if (!isConnected) {
      // use the injected connected to prompt the user to connect their wallet
      connect({ connector: injected() });
    }
    // handle the badge click logic here, e.g., open wallet details
    logger.trace("Wallet status badge clicked.");
  }
  // render the badge
  return (
    <Badge
      {...props}
      ref={ref}
      id="web3-status-badge"
      variant={variant}
      className={cn(
        "inline-flex flex-nowrap overflow-x-clip items-center gap-1 px-2 py-1",
        "hover:cursor-pointer",
        className,
      )}
      onClick={(event) => {
        // prevent the default action
        event.preventDefault();
        // stop the event from propgating
        event.stopPropagation();
        // handle the click
        handleOnClick();
      }}
    >
      <div
        className={cn(
          "h-4 w-4 rounded-full bg-blend-color",
          isConnected ? "bg-green-500" : "bg-red-500",
        )}
      />
      <span
        className={cn(
          "text-muted-foreground text-nowrap",
          showLabel ? "not-sr-only" : "sr-only",
        )}
      >
        {chain ? chain.name : "Not Connected"}
      </span>
    </Badge>
  );
};
WalletStatus.displayName = "Web3Badge";

export default WalletStatus;
