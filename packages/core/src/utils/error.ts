/**
 * Created At: 2025.10.12:01:33:58
 * @author - @FL03
 * @directory - src/lib/error
 * @file - helpers.ts
 */
/** A method for resolving unknown errors */
export const resolveError = (error: unknown): Error => (
  (error instanceof Error) ? error : new Error(String(error))
);
