/**
 * Created At: 2025.07.27:17:04:59
 * @author - @FL03
 * @file - wallet/provider.tsx
 */
"use client";
// imports
import { PropsWithChildren } from "react";
import React from "react";

type WalletContext = {
  address?: string;
};

// declare the `WalletContext` instance which will be used to provide wallet information
const WalletContext = React.createContext<WalletContext | undefined>(undefined);

/** The `useWallet` hook provides the component with access to the wallet provided context. */
export const useWallet = () => {
  // i
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

/** The `WalletProvider` component provides various paramaters, methods, and more */
export const WalletProvider: React.FC<
  PropsWithChildren<{ address?: string; username?: string }>
> = ({ address, children }) => {
  // memoize the context to reduce unnecessary re-renders
  const context = React.useMemo(() => ({ address }), [address]);
  // provide the wallet context with the address
  return (
    <WalletContext.Provider value={context}>
      {children}
    </WalletContext.Provider>
  );
};
WalletProvider.displayName = "WalletProvider";

export default WalletProvider;
