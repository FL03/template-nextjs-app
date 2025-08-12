/**
 * Created At: 2025.07.27:13:14:07
 * @author - @FL03
 * @file - web3-provider.tsx
 */
"use client";
// imports
import * as React from "react";
import { type State, WagmiProvider } from "wagmi";
import { base, Chain } from "wagmi/chains"; // add baseSepolia for testing
// import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// project
import { getWeb3Config } from "@/lib/web3";

type WidgetPropsT = {
  coinbaseApiKey?: string;
  chain?: Chain;
  initialState?: State;
};

/**
 * This component provides the OnchainKitProvider with the base chain.
 */
export const Web3Provider: React.FC<
  React.PropsWithChildren<WidgetPropsT>
> = (
  {
    children,
    initialState,
  },
) => {
  // define the config state, initialized using the getWeb3Config callback
  const [config] = React.useState(getWeb3Config);
  // setup the query client for react-query
  const [queryClient] = React.useState(() => new QueryClient());
  // render the OnchainKitProvider with the base chain
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
Web3Provider.displayName = "Web3Provider";

export default Web3Provider;
