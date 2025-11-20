/**
 * Created At: 2025.11.19:20:07:14
 * @author - @FL03
 * @directory - src/components/common/dashboard
 * @file - dashboard-panel.tsx
 */
"use client";
// imports
import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";

const dashboardPanelVariants = cva(
  "relative z-auto flex flex-col h-full gap-4 lg:gap-6 rounded",
  {
    defaultVariants: {
      flavor: "default",
      layout: "default",
      size: "default",
      variant: "default",
    },
    variants: {
      flavor: {
        default: "bg-transparent text-foreground border-border",
        surface: "bg-surface text-foreground border-border",
        accent: "bg-accent text-accent-foreground border-accent-foreground/25",
        primary:
          "bg-primary text-primary-foreground border-primary-foreground/25",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary-foreground/25",
      },
      layout: {
        default: "w-fit",
        expand: "flex-1 w-full",
      },
      position: {
        default: "",
        leading: "order-first left-0",
        trailing: "order-last right-0",
      },
      size: {
        default: "p-4",
        lg: "p-6",
        sm: "p-2",
      },
      variant: {
        default: "border-none",
        outlined: "border drop-shadow-sm shadow-inner",
      },
    },
  },
);

export const DashboardPanel: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "title">
  & VariantProps<typeof dashboardPanelVariants>
  & {
    asChild?: boolean;
    scrollable?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  scrollable,
  flavor = "default",
  layout = "default",
  position = "default",
  size = "default",
  variant = "default",
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot="dashboard-panel"
      className={cn(
        dashboardPanelVariants({ flavor, layout, size, variant }),
        scrollable && "overflow-y-auto",
        className,
      )}
    />
  );
};
DashboardPanel.displayName = "DashboardPanel";
