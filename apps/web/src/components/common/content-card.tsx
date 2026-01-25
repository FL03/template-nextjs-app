// message-card.tsx
import * as React from "react";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** A scaffold for a common card component often used to render text-based content.  */
export const ContentCard: React.FC<
  & React.PropsWithChildren<
    Omit<React.ComponentPropsWithRef<"div">, "title" | "action">
  >
  & {
    action?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    classNames?: ClassNames<
      "action" | "content" | "description" | "header" | "title"
    >;
    hideTitle?: boolean;
    showDescription?: boolean;
  }
> = ({
  ref,
  action,
  children,
  className,
  classNames,
  description,
  title,
  hideTitle,
  showDescription,
  ...props
}) => (
  <Card
    {...props}
    ref={ref}
    className={cn("flex flex-1 flex-col h-full w-full", className)}
  >
    <CardContent
      className={cn("flex-1 h-full w-full")}
    >
      <CardHeader className={cn("w-full", classNames?.headerClassName)}>
        <CardTitle
          hidden={!title}
          className={cn(
            "text-xl",
            hideTitle ? "sr-only" : "not-sr-only",
            classNames?.titleClassName,
          )}
        >
          {title}
        </CardTitle>
        <CardDescription
          hidden={!description}
          className={cn(
            showDescription ? "not-sr-only" : "sr-only",
            classNames?.descriptionClassName,
          )}
        >
          {description}
        </CardDescription>
        {action && (
          <CardAction className={classNames?.actionClassName}>
            {action}
          </CardAction>
        )}
      </CardHeader>
      <CardFooter
        hidden={!children}
        className={cn(
          "flex flex-1 items-center justify-center h-full w-full",
          classNames?.contentClassName,
        )}
      >
        {children}
      </CardFooter>
    </CardContent>
  </Card>
);
ContentCard.displayName = "ContentCard";
