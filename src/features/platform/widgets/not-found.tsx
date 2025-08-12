/**
 * Created At: 2025.07.17:07:29:16
 * @author - @FL03
 * @file - not-found/page.tsx
 */
"use client";
// imports
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import React from "react";

/** The component used as a fallback for any routes that are not found.  */
export const NotFound: React.FC<
  React.ComponentPropsWithRef<typeof Card> & { message?: string }
> = ({ ref, children, message, ...props }) => {
  // set defaults
  message ??= "The requested resource could not be found.";
  return (
    <Card ref={ref} {...props}>
      <CardHeader className="flex flex-nowrap items-start gap-2 w-full">
        <div className="flex flex-1 flex-col w-full gap-2 order-first">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Not Found
          </CardTitle>
          <CardDescription className="leading-snug tracking-tight text-muted-foreground">
            Could not find requested resource
          </CardDescription>
        </div>
        <div className="inline-flex flex-nowrap items-center justify-end gap-2 order-last">
          <CardAction>
            <Button asChild variant="link" size="sm">
              <Link
                href="/"
                className="flex flex-nowrap items-center gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};
NotFound.displayName = "NotFoundCard";
