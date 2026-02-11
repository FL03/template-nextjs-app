/**
 * Created At: 2025.11.01:09:57:48
 * @author - @FL03
 * @directory - src/components/common/cards
 * @file - content-card.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ArticleCard: React.FC<
  React.ComponentPropsWithRef<typeof Card> & {
    author?: string;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    withFooter?: boolean;
    classNames?: ClassNames<
      "content" | "description" | "header" | "footer" | "title"
    >;
  }
> = (
  {
    ref,
    author,
    children,
    className,
    classNames,
    description,
    footer,
    title,
    showDescription,
    withFooter,
    ...props
  },
) => (
  <Card
    ref={ref}
    className={cn(
      "relative z-auto flex flex-1 flex-col h-full w-full",
      className,
    )}
    {...props}
  >
    <CardHeader className={cn("pb-2", classNames?.headerClassName)}>
      <CardTitle
        className={cn("text-lg font-semibold", classNames?.titleClassName)}
        hidden={!title}
      >
        {title}
      </CardTitle>
      <CardDescription
        className={cn(
          "text-sm text-muted-foreground",
          showDescription ? "not-sr-only" : "sr-only",
          classNames?.descriptionClassName,
        )}
        hidden={!description}
      >
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent
      className={cn(
        "flex flex-1 flex-col h-full w-full gap-1",
        classNames?.contentClassName,
      )}
    >
      {children}
    </CardContent>
    {/* footer */}
    {footer && (
      <CardFooter
        className={cn(
          "order-last flex items-center w-full",
          classNames?.footerClassName,
        )}
      >
        {author && (
          <div className="inline-flex flex-nowrap items-center justify-end gap-1 right-0">
            <span className="text-muted-foreground">Author:</span>
            <span className="font-semibold">{author}</span>
          </div>
        )}
      </CardFooter>
    )}
  </Card>
);
ArticleCard.displayName = "ContentCard";
