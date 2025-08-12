/**
 * Created At: 2025.07.27:16:08:58
 * @author - @FL03
 * @file - wagmi.ts
 */
import {
  Config,
  cookieStorage,
  createConfig,
  createStorage,
  http,
  Connector, 
  CreateConnectorFn,
} from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains"; // add baseSepolia for testing
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getWeb3Config>;
  }
}
/** A generic type alias defining the various objects capable of being used as a connector within the `wagmi` framework. */
export type WagmiConnector = Connector | CreateConnectorFn;

/**
 * Initialize a custom configuration for the `wagmi` integration, defining the supported chains, connectors, storage options, and transport methods.
 * @returns {Config} The configuration object for `wagmi`.
 * @url https://wagmi.sh/react/docs/config
 */
export const getWeb3Config = (): Config => {
  return createConfig({
    chains: [base, baseSepolia, mainnet], // add baseSepolia for testing
    connectors: [
      injected(),
      coinbaseWallet({
        appName: "OnchainKit",
        preference: "smartWalletOnly",
        version: "4",
      }),
      metaMask(),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(), // add baseSepolia for testing
      [baseSepolia.id]: http(),
      [mainnet.id]: http(),
    },
  });
};
