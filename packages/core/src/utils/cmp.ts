/**
 * Created At: 2025.10.23:13:25:13
 * @author - @FL03
 * @directory - src/lib/utils
 * @file - cmp.ts
 */
/** returns true if the given parameter matches any of the  */
export const matches = <TData>(
  arg: TData,
  ...opts: TData[]
): boolean => (
  Boolean(opts?.find((v) => v === arg))
);
