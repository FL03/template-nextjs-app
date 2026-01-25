/**
 * Created At: 2025.09.30:13:49:25
 * @author - @FL03
 * @directory - src/lib/utils
 * @file - rand.ts
 */

/** Generates a random integer between the given boundaries */
export const randomIntBetween = (
  { min = 1000, max = 9999 }: { min?: number | string; max?: number | string } =
    {},
): number => {
  min = Math.ceil(Number(min)); // Ensure min is an integer
  max = Math.floor(Number(max)); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
