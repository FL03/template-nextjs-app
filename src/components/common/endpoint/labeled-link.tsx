/**
 * Created At: 2025.08.05:17:37:44
 * @author - @FL03
 * @file - endpoint.tsx
 */
"use client";
// imports
import React from "react";
import Link from "next/link";
// project
import { cn } from "@/lib/utils";

/**
 * The `Endpoint` component is an extension or wrapper over the `Link` element provided by Next.JS pre-configured to support an optional label rendered directly alongside any children
 * (typically an icon) that are passed to the component.
 */
export const Endpoint: React.FC<
  & React.ComponentPropsWithRef<typeof Link>
  & React.PropsWithChildren<
    { label?: React.ReactNode; hideLabel?: boolean; reversed?: boolean }
  >
> = (
  { ref, children, className, href, label, hideLabel, reversed, ...props },
) => {
  return (
    <Link
      {...props}
      ref={ref}
      href={href}
      className={cn(
        "inline-flex flex-nowrap items-center gap-1",
        reversed && "flex-row-reverse",
        className,
      )}
    >
      {children && <div className="leading-none tracking-tight">{children}
      </div>}
      {label && (
        <span className={hideLabel ? "sr-only" : "not-sr-only"}>{label}</span>
      )}
    </Link>
  );
};
Endpoint.displayName = "Endpoint";

export default Endpoint;
