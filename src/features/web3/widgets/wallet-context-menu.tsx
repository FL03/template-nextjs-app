/**
 * Created At: 2025.07.27:19:26:04
 * @author - @FL03
 * @file - wallet-context-menu.tsx
 */
"use client";
// imports
import * as React from "react";
import { injected, useAccount, useConnect, useDisconnect } from "wagmi";
// project
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

/**
 * The `WalletContextMenu` component is a wrapper that equips the children with a so-called `ContextMenu` triggered
 * whenever a right-click is detected within the bounds of the element.
 */
export const WalletContextMenu: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  // get a reference to the connected account
  const { address, chain } = useAccount();
  // memoize the state of the account address; returns true if a wallet is connected
  const isConnected = React.useMemo(() => Boolean(address), [address]);
  // get access to the wagmi connection api
  const { connect } = useConnect();
  // get access to the wagmi disconnect api
  const { disconnect } = useDisconnect();

  // handle the authentication logic
  async function handleConnect() {
    // handle the case where a wallet is already connected
    if (isConnected) {
      // disconnect the wallet
      disconnect();
      return;
    }
    // otherwise, connect to a wallet using an injected connector
    connect({ connector: injected() });
  }
  // render the component
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Network</ContextMenuLabel>
          <ContextMenuItem>
            {chain?.name}
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuGroup>
          <ContextMenuLabel>Wallet</ContextMenuLabel>
          <ContextMenuItem
            variant={isConnected ? "destructive" : "default"}
            onClick={(event) => {
              // prevent the default event
              event.preventDefault();
              // stop the event from bubbling upward
              event.stopPropagation();
              // invoke the connection handler
              handleConnect();
            }}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
