/**
 * Created At: 2025.10.22:20:13:23
 * @author - @FL03
 * @directory - src/components/common
 * @file - details.tsx
 */
"use client";
//imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import { BackButton } from "@/components/common/button";
import {
  Tile,
  TileContent,
  TileDescription,
  TileLeading,
  TileTitle,
  TileTrailing,
} from "@/components/common/tile";

/** The `DetailScaffold` component renders a common layout for detail-oriented, single-item views. */
export const DetailScaffold: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "title">
  & React.PropsWithChildren<{
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    description?: React.ReactNode;
    title?: React.ReactNode;
    withBack?: boolean;
    showDescription?: boolean;
    classNames?: {
      contentClassName?: string;
      descriptionClassName?: string;
      titleClassName?: string;
      trailingClassName?: string;
    };
  }>
> = (
  {
    ref,
    children,
    className,
    description,
    leading,
    title,
    trailing,
    withBack,
    showDescription,
    classNames = {},
    ...props
  },
) => (
  <div
    ref={ref}
    className={cn(
      "relative z-auto flex flex-1 flex-col min-h-full w-full gap-4 lg:gap-6",
      className,
    )}
    {...props}
  >
    <Tile className="order-first">
      <TileLeading>
        {withBack && <BackButton />}
        {leading}
      </TileLeading>
      <TileContent>
        {title && (
          <TileTitle
            className={cn("text-xl font-bold", classNames?.titleClassName)}
          >
            {title}
          </TileTitle>
        )}
        {description && (
          <TileDescription
            className={cn(
              classNames?.descriptionClassName,
            )}
            hidden={!showDescription}
          >
            {description}
          </TileDescription>
        )}
      </TileContent>
      {trailing && (
        <TileTrailing className={classNames?.trailingClassName}>
          {trailing}
        </TileTrailing>
      )}
    </Tile>
    <section
      className={cn(
        "order-last flex flex-1 flex-col h-full w-full gap-4 lg:gap-6",
        classNames?.contentClassName,
      )}
    >
      {children}
    </section>
  </div>
);
DetailScaffold.displayName = "DetailScaffold";
