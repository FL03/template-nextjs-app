/**
 * Created At: 2025.07.26:14:19:10
 * @author - @FL03
 * @file - constants.ts
 */
import { getEnvironmentVariable } from "@/lib/utils";

/** A convenience method for fetching the `NEXT_PUBLIC_COINBASE_API_KEY` environment variable. */
export const coinbaseApiKey = (
  key: string = "NEXT_PUBLIC_COINBASE_API_KEY",
): string => {
  // fetch the environment variable for the Supabase URL
  const value = process.env[key];
  // handle the case where no value was found
  if (!value) {
    // then throw an error
    throw new Error(`Missing the \`${key}\` environment variable`);
  }
  // return the parsed value
  return value.trim();
};

/** A convenience method for fetching the `COINBASE_API_SECRET_KEY` variable from the environment. */
export const coinbaseSecretKey = (
  key: string = "COINBASE_API_SECRET_KEY",
): string => {
  return getEnvironmentVariable(key);
};

type CoinbaseApiCredentialsT = {
  id: string;
  privateKey: string;
};
/**
 * This callback fetches the Coinbase API credentials from the environment variables.
 * @returns {CoinbaseApiCredentialsT} - an object containing the Coinbase API credentials
 */
export const coinbaseApiCredentials = (): CoinbaseApiCredentialsT => ({
  id: coinbaseApiKey(),
  privateKey: coinbaseSecretKey(),
});
