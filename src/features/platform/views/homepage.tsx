/**
 * Created At: 2025.07.05:08:39:48
 * @author - @FL03
 * @file - landing-screen.tsx
 */
"use client";
// imports
import * as React from "react";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
// project
import { cn } from "@/lib/utils";
// components
import { PzzldLogo } from "@/components/common/icons";
import {
  Tile,
  TileContent,
  TileDescription,
  TileFooter,
  TileHeader,
  TileLeading,
  TileTitle,
} from "@/components/common/tile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

export const HomePage: React.FC<
  Omit<React.ComponentPropsWithoutRef<"div">, "children">
> = ({ className, ...props }) => (
  <div
    className={cn(
      "relative z-auto flex flex-1 flex-col items-center h-full w-full gap-4 lg:gap-6",
      className,
    )}
    {...props}
  >
    {/* Hero */}
    <Tile className="max-w-xl">
      <TileLeading>
        <PzzldLogo className="h-36 w-36" />
      </TileLeading>
      <TileContent>
        <TileHeader>
          <TileTitle className="text-xl">
            Tip Tracker
          </TileTitle>
          <TileDescription>
            A comprehensive tip tracking solution designed to help you manage
            and analyze your tips with ease.
          </TileDescription>
        </TileHeader>
        <TileFooter className="justify-end">
          <Button asChild variant="secondary">
            <Link href="/pricing">
              <span className="text-nowrap text-sm">Pricing</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </Button>
        </TileFooter>
      </TileContent>
    </Tile>
    {/* Features */}
    <Card className="flex-1 w-full">
      <CardHeader>
        <CardTitle className="text-lg">Features</CardTitle>
        <CardDescription className="sr-only">
          Explore the powerful features of Tip Tracker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item size="sm">
            <ItemContent>
              <ItemTitle>
                Ledger
              </ItemTitle>
              <ItemDescription>
                Maintain a personal ledger of all your earned tips
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemTitle>Analytics</ItemTitle>
              <ItemDescription>
                Gain insights into your tipping patterns with detailed analytics
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  </div>
);
HomePage.displayName = "HomePage";

export default HomePage;
