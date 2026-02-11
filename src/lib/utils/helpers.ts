/**
 * Created At: 2025.10.25:14:35:40
 * @author - @FL03
 * @directory - src/lib/utils
 * @file - helpers.ts
 */

/** A utilitarian function for creating valid filenames */
export function formatFileName<Name extends string, Ext extends string>(
  name: Name,
  ext: Ext,
): `${Name}.${Ext}` {
  return `${name}.${ext}`;
}
/** A utility function for testing regex patterns. */
export const matches = <V extends string>(value: V, pattern: RegExp): boolean =>
  pattern.test(value);

/** Use regex to validate a given email address */
export const verifyEmailFormat = (email: string) =>
  new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).test(email);

export const matchesUpdate = <V extends string>(value: V): boolean =>
  matches(value, /^(:?update|edit)$/gim);

export const matchesDelete = <V extends string>(value: V): boolean =>
  matches(value, /^(:?del|delete|remove)$/gim);

export const matchesRead = <V extends string>(value: V): boolean =>
  matches(value, /^(:?read|view)$/gim);
