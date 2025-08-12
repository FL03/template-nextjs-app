/**
 * Created At: 2025.07.28:08:51:09
 * @author - @FL03
 * @file - server.ts
 */
"use server";
// local
import { createCdpClient } from "../cdp";

/** Create a new `evm` compatible wallet for the user using the coinbase sdk. */
export const createWallet = async () => {
  // create a new coinbase client
  const cdp = createCdpClient();
  // // create a new wallet
  // const wallet = await cdp.evm.createAccount();
  // // return the wallet
  // return wallet;
};
