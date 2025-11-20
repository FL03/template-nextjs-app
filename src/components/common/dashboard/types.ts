/**
 * Created At: 2025.11.19:20:10:03
 * @author - @FL03
 * @directory - src/components/common/dashboard
 * @file - types.ts
 */
// imports
import * as React from "react";
import { ClassNames } from "@pzzld/core";
// components
import { Button } from "@/components/ui/button";

export type WithPanelProps<T = {}> = T & {
  action?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
  classNames?: ClassNames<
    | "action"
    | "content"
    | "header"
    | "description"
    | "title"
  >;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  pinned?: boolean;
  hideTitle?: boolean;
  showDescription?: boolean;
};
