/**
 * Created At: 2025.08.05:18:19:22
 * @author - @FL03
 * @file - endpoint-button.tsx
 */
import * as React from "react";
import Link from "next/link";
// components
import { Button } from "@/components/ui/button";
import Endpoint from "./labeled-link";

export const LinkButton: React.FC<
  & Omit<
    React.ComponentPropsWithRef<typeof Button>,
    "asChild" | "children" | "title" | "onClick"
  >
  & React.PropsWithChildren<{
    label?: React.ReactNode;
    href: React.ComponentProps<typeof Link>["href"];
    showLabel?: boolean;
  }>
> = ({
  ref,
  children,
  href,
  label,
  showLabel,
  size = "default",
  variant = "link",
  ...props
}) => {
  // render the component
  return (
    <Button {...props} asChild ref={ref} size={size} variant={variant}>
      <Endpoint href={href} label={label} hideLabel={!showLabel}>
        {children}
      </Endpoint>
    </Button>
  );
};
LinkButton.displayName = "LinkButton";

export default LinkButton;
