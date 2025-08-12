/**
 * Created At: 2025.07.28:08:45:59
 * @author - @FL03
 * @file - cdp.ts
 */
// import { CdpClient } from "@coinbase/cdp-sdk";

type CdpClientCredentials = {
  apiKeyId: string;
  apiKeySecret: string;
  walletSecret?: string;
};

// fetch the credentials from the environment variables
const getCredentials = (): CdpClientCredentials => {
  const apiKeyId = process.env.NEXT_PUBLIC_COINBASE_API_KEY;
  const apiKeySecret = process.env.COINBASE_API_SECRET_KEY;
  if (!apiKeyId || !apiKeySecret) {
    throw new Error(
      "Coinbase API credentials are not set. Please set NEXT_PUBLIC_COINBASE_API_KEY and COINBASE_API_SECRET_KEY environment variables.",
    );
  }
  return {
    apiKeyId,
    apiKeySecret,
    walletSecret: process.env.COINBASE_WALLET_SECRET,
  };
};
class CdpClient {
  private _accessPass: CdpClientCredentials;

  constructor(credentials?: CdpClientCredentials) {
    // use the provided credentials or fetch them from the environment
    this._accessPass = credentials ?? getCredentials();
  }

  /** Reveal the apiKeyId associated with the client. */
  get apiKeyId() {
    return this._accessPass.apiKeyId;
  }
}

type ClientOptions = {
  apiKey?: string;
  secretKey?: string;
  walletSecret?: string;
};

type CreateClientT = (options?: ClientOptions) => CdpClient;

export const createCdpClient: CreateClientT = (options = {}) => {
  // create and return the client
  return new CdpClient();
};
