/**
 * Created At: 2025.07.27:19:02:56
 * @author - @FL03
 * @file - wallet-button.tsx
 */
"use client";
// imports
import * as React from "react";
import { WalletMinimalIcon } from "lucide-react";
import {
  Connector,
  CreateConnectorFn,
  injected,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
import { formatWeb3Address } from "@/lib/web3";

type ClassNames = {
  iconClassName?: string;
  labelClassName?: string;
};

/**
 * The `WalletButton` component displays a fallback message when not connected, rendering an abbreviated address or the associated ensName
 * when connected. It enables developers to specify custom class names for the icon and label, and allows for a connector to be passed in as a prop.
 * Additionally, the component allows for a custom handler to be executed whenever the wallet is connected.
 */
export const WalletButton: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "asChild" | "children" | "onClick"
  > & {
    classNames?: ClassNames;
    connector?: Connector | CreateConnectorFn;
    handleConnected?: () => void;
  }
> = (
  {
    className,
    classNames,
    handleConnected,
    connector = injected(),
    size = "default",
    variant = "outline",
    ...props
  },
) => {
  // destructure the classNames object
  const { iconClassName, labelClassName } = classNames || {};
  // a signal for indicating if the button is in icon mode
  const isIcon = React.useMemo<Boolean>(() => size === "icon", [size]);
  // use the wagmi useAccount hook to get the current account information
  const { address } = useAccount();
  // use the address to resolve the ensName, if any
  const { data: ensName } = useEnsName({ address });
  // use wagmi's useConnect hook to get the connect function and available connectors
  const { connect } = useConnect();
  // returns true if a wallet is connected
  const isConnected = React.useMemo(() => Boolean(address), [address]);

  // resolve the display address and memoize it
  const displayAddress = React.useMemo(() => {
    // if ENS name is available, use it
    if (ensName) return ensName;
    // otherwise, return the address
    return address
      ? formatWeb3Address(address)
      : "Not connected";
  }, [ensName, address]);
  // handle the onClick event for the button
  async function handleOnClick() {
    if (!isConnected) {
      // use the injected connected to prompt the user to connect their wallet
      connect({ connector });
    }
    // otherwise,
    handleConnected?.();
  }
  // render the component
  return (
    <Button
      {...props}
      size={size}
      variant={isConnected ? "destructive" : variant}
      className={cn(
        "inline-flex flex-nowrap items-center gap-2 px-2 py-1",
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
      <WalletMinimalIcon className={cn("h-4 w-4", iconClassName)} />
      <span
        className={cn(
          "text-muted-foreground",
          labelClassName,
          isIcon ? "sr-only" : "not-sr-only",
        )}
      >
        {isConnected ? displayAddress : "Connect"}
      </span>
    </Button>
  );
};
WalletButton.displayName = "WalletButton";

export default WalletButton;
