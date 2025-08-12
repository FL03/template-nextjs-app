/**
 * Created At: 2025.07.28:09:43:03
 * @author - @FL03
 * @file - helpers.ts
 */

type BalanceHandlerOptsT = {
  decimals?: number;
};

type BalanceHandler = (value: any, options?: BalanceHandlerOptsT) => number;

/**
 * @param value - The value to handle, typically a BigInt or string representing a balance.
 * @param options - An optional object containing the number of decimal places to consider.
 * @returns {number} - The formatted balance as a number; if no value is provided, defaults to 0.
 */
export const handleBalance: BalanceHandler = (
  value?: string | number | bigint | null,
  options?: BalanceHandlerOptsT,
) => {
  // if no value is provided, return 0
  if (!value) {
    return 0;
  }
  // destructure the options and set their defaults
  const { decimals = 18 } = options || {};
  // ensure the value is a BigInt
  const parsed = value as bigint;
  // compute the divisor
  const divisor = 10n ** BigInt(decimals);
  // compute the whole and fractional parts
  const whole = Number(parsed / divisor);
  // compute the remainder and divide it by the divisor to get the fractional part
  const fractional = Number(parsed % divisor) / Number(divisor);
  // sum together the pieces and return the result
  return whole + fractional;
};

type AddrFormatOptions = {
  endsWith?: number;
  startsWith?: number;
  truncate?: boolean;
};
/**
 * A simple callback for formatting a Web3 address for display purposes
 * @param address - The address to format
 * @param options - The options for formatting the address
 * @return {string} - The formatted address
 */
export const formatWeb3Address = (
  address: string,
  options?: AddrFormatOptions,
): string => {
  // destructure the options define their defaults
  let { endsWith = 4, startsWith = 6 } = options || {};
  // return the formatted address
  return `${address.slice(0, startsWith)}...${address.slice(-endsWith)}`;
};
