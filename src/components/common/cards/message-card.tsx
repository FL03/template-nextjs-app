// message-card.tsx
import * as React from "react";
// project
import { cn } from "@/lib/utils";
import { ClassNames } from "@/types";
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

/** The  */
export const MessageCardScaffold: React.FC<
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
    className={cn("flex flex-1 h-full w-full", className)}
  >
    <CardContent
      className={cn("flex-1 h-full w-full")}
    >
      <CardHeader>
        {title && (
          <CardTitle
            className={cn(
              "text-xl",
              hideTitle ? "sr-only" : "not-sr-only",
              classNames?.titleClassName,
            )}
          >
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription
            className={cn(
              showDescription ? "not-sr-only" : "sr-only",
              classNames?.descriptionClassName,
            )}
          >
            {description}
          </CardDescription>
        )}
        {action && (
          <CardAction className={classNames?.actionClassName}>
            {action}
          </CardAction>
        )}
      </CardHeader>
      {children && (
        <CardFooter
          className={cn(
            "flex flex-1 items-center justify-center h-full w-full",
            classNames?.contentClassName,
          )}
        >
          {children}
        </CardFooter>
      )}
    </CardContent>
  </Card>
);
