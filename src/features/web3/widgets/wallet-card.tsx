/**
 * Created At: 2025.07.27:14:16:40
 * @author - @FL03
 * @file - wallet-card.tsx
 */
"use client";
// imports
import * as React from "react";
import { useAccount } from "wagmi";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// components
import {
  Header,
  HeaderContent,
  HeaderTitle,
  HeaderTrailing,
} from "@/components/common/header";
// local
import { WalletAddress } from "./wallet-address";
import { WalletContextMenu } from "./wallet-context-menu";
import { WalletStatus } from "./wallet-status";

/**
 * The `WalletCard` widget is a customizable component extending the capabilities of the integrated providers to
 * provider a clear and concise portfolio of the active wallet.
 */
export const WalletCard: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title">
> = ({
  ref,
  children,
  className,
  ...props
}) => {
  // access the onchain kit context
  const { address } = useAccount();
  // handle the case where no wallet is connected
  if (!address) {
    // log a warning
    logger.warn("Please connect your wallet to view the wallet card.");
    // return null to avoid rendering the card
    return null;
  }
  // render the component
  return (
    <WalletContextMenu>
      <div
        {...props}
        ref={ref}
        className={cn(
          "flex flex-col px-2 py-1",
          "text-foreground bg-gradient-to-br from-100% to-75% via-accent",
          "border border-accent/20 rounded-xl shadow-inner drop-shadow-lg drop-shadow-accent/10",
          className,
        )}
      >
        {/* header */}
        <Header>
          <HeaderContent>
            <HeaderTitle>
              <WalletAddress />
            </HeaderTitle>
          </HeaderContent>
          <HeaderTrailing>
            <WalletStatus showLabel />
          </HeaderTrailing>
        </Header>
        <div className="flex flex-col flex-1 gap-2 w-full h-full ">
          {children}
        </div>
      </div>
    </WalletContextMenu>
  );
};
WalletCard.displayName = "WalletCard";

export default WalletCard;
