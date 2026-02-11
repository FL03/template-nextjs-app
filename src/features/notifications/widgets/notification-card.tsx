/**
 * Created At: 2025.11.08:15:37:15
 * @author - @FL03
 * @directory - src/features/notifications/widgets
 * @file - notification-card.tsx
 */
"use client";
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// local
import type { NotificationData } from "../types";
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
import { NotificationItemDropdownMenu } from "./actions";
import { ButtonGroup } from "@/components/ui/button-group";

export const NotificationCard: React.FC<
  & Omit<React.ComponentPropsWithoutRef<typeof Card>, "children">
  & { value?: NotificationData | null }
> = ({ className, value, ...props }) => (
  <Card
    {...props}
    className={cn(
      "flex flex-col w-full max-w-lg",
      className,
    )}
  >
    <CardContent className="flex-1 h-full w-full">
      <CardHeader>
        <CardTitle>{value?.sender}</CardTitle>
        <CardAction>
          <ButtonGroup>
            <NotificationItemDropdownMenu value={value} />
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <CardDescription>{value?.message}</CardDescription>
      </CardFooter>
    </CardContent>
  </Card>
);
