/**
 * Created At: 2025.09.23:20:50:18
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - business-card.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// local
import { OrganizationData } from "../types";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface BusinessCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "children"> {
  org: OrganizationData;
  showDescription?: boolean;
}
export const BusinessCard: React.FC<BusinessCardProps> = (
  { className, org, showDescription, ...props },
) => (
  <Card className={cn("flex flex-1 flex-col w-full")} {...props}>
    <CardHeader>
      <CardTitle className="text-lg font-bold">{org.name}</CardTitle>
      <CardDescription
        className={cn(
          "text-sm text-muted-foreground",
          showDescription ? "not-sr-only" : "sr-only",
        )}
      >
        {org.description}
      </CardDescription>
      <CardContent>
        <ul className="flex flex-col gap-1">
          {org.homepage && (
            <li className="flex flex-1 flex-nowrap items-center gap-2">
              <strong>Homepage:</strong>{" "}
              <Link
                href={org.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Homepage
              </Link>
            </li>
          )}
          {org.structure && (
            <li className="flex flex-1 flex-nowrap items-center gap-2">
              <span>Structure: {org.structure}</span>
            </li>
          )}
        </ul>
      </CardContent>
    </CardHeader>
  </Card>
);
BusinessCard.displayName = "BusinessCard";

export default BusinessCard;
