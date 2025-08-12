/**
 * Created At: 2025.07.05:08:39:48
 * @author - @FL03
 * @file - landing-screen.tsx
 */
"use client";
// imports
import * as React from "react";
import Link from "next/link";
// project
import { cn } from "@/lib/utils";
// components
import { FlexHeader } from "@/components/common/header";
import { Button } from "@/components/ui/button";

export const LandingScreen: React.FC<
  Omit<React.ComponentPropsWithoutRef<"div">, "children">
> = ({ className, ...props }) => {
  // render the landing screen
  return (
    <div
      className={cn(
        "flex flex-1 gap-2 h-full w-full",
        "items-center justify-center",
        className,
      )}
      {...props}
    >
      {/* hero */}
      <div
        className={cn(
          "flex flex-col w-full px-4 py-2",
          "bg-accent text-accent-foreground border border-accent/10 rounded-xl",
          "drop-shadow-xl shadow-inner drop-shadow-accent/20",
        )}
      >
        {/* header */}
        <FlexHeader
          title="pzzld"
          description="A customizable platform demonstrating the abilities of the scsys ecosystem."
        />
        {/* footer */}
        <div className="flex flex-nowrap items-center justify-end w-full gap-4 lg:gap-6">
          <div className="ml-auto inline-flex justify-end gap-4 lg:gap-6 w-full ">
            <Button
              asChild
              variant="link"
              className="inline-flex flex-nowrap items-center gap-2"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
LandingScreen.displayName = "LandingScreen";

export default LandingScreen;
