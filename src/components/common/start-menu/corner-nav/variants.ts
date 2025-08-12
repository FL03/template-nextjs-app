import { cva, VariantProps } from "class-variance-authority";

export const headerContainerVariants = cva(
  // Base header container classes shared across sizes
  "relative flex items-center gap-3 border-b border-slate-700/50 cursor-pointer transition-all duration-300 bg-slate-800/90",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "p-3",
        compact: "p-2", // reserved for future
        extended: "p-4",
      },
      variant: {
        default: "",
      },
    },
  },
);

export const headerTextWrapVariants = cva(
  // Text wrapper styles
  "text-white flex-1 min-w-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "",
        extended: "sr-only", // hide title/subtitle in icon size
        compact: "sr-only", // reserved: could shorten font-sizes later
      },
      variant: {
        default: "",
      },
    },
  },
);

export const widgetShellVariants = cva(
  // Outer shell of the widget
  "relative overflow-visible shadow-2xl bg-slate-900/95 border border-slate-700/60 backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      defaultVariants: {
        size: "default",
        variant: "default",
      },
      size: {
        default: "w-auto",
        compact: "",
        extended: "w-80", // roughly 320px wide
      },
      variant: {
        default: "",
      },
    },
  },
);

// Future-proof size system for the header/banner and container.
// Add more sizes later by extending the union and the variants below.
export type MenuSize = "default" | "compact" | "extended";

export type MenuHeaderVariants = VariantProps<typeof headerContainerVariants>;

export type MenuSurfaceVariants = VariantProps<typeof widgetShellVariants>;
