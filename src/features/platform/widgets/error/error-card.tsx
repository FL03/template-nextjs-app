// error-card.tsx
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ErrorCardProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  message?: string;
  status?: string | number;
  asChild?: boolean;
};

/**
 * A simple component to display an error card with a title, description, and message.
 */
export const ErrorCard: React.FC<
  & React.PropsWithChildren<
    Omit<React.ComponentPropsWithRef<typeof Card>, "title">
  >
  & ErrorCardProps
> = ({
  ref,
  children,
  className,
  message,
  status = 500,
  description = "An unexpected error occurred; please try again later.",
  title = "Error",
  asChild,
  ...props
}) => {
  // render the component as a slot whenever asChild is true
  const Comp = asChild ? Slot : Card;
  // render the error card
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn("container mx-auto flex flex-col flex-1 w-full", className)}
    >
      <CardHeader className="flex flex-nowrap items-center gap-2">
        <div className="inline-flex flex-col flex-1">
          <CardTitle className="text-xl leading-none tracking-tight">
            {title}
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-sm">
          {typeof status === "number" ? `HTTP ${status}` : status}
        </Badge>
      </CardHeader>
      {children && (
        <CardContent className="flex flex-col flex-1 w-full">
          {message}
        </CardContent>
      )}
      <CardFooter>
        {description && <CardDescription>{description}</CardDescription>}
      </CardFooter>
    </Comp>
  );
};
