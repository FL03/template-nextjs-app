/**
 * Created At: 2025.09.30:14:16:48
 * @author - @FL03
 * @directory - src/types/props
 * @file - core.tsx
 */

/** A type alias for defining all possible _text sizes_ provided by tailwindcss. */
export type TextSize =
  | "base"
  | "xs"
  | "sm"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

/** A type defining binary string variants of `left` or `right`. */
export type SideX = "left" | "right";
/** A type defining binary string variants of `top` or `bottom`. */
export type SideY = "top" | "bottom";
/** A simple type literal for the four sides of a 2-dimensional surface; i.e. left, right, top, bottom. */
export type LRTB = SideX | SideY;