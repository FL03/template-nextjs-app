/**
 * Created At: 2025.10.05:11:12:09
 * @author - @FL03
 * @directory - src/types/cmp
 * @file - button.ts
 */
import { VariantProps } from "class-variance-authority";
// components
import type { buttonVariants } from "@/components/ui/button";

export type WithButtonVariants<T = {}> =
  & T
  & VariantProps<typeof buttonVariants>;
