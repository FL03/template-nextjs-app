/**
 * Created At: 2025.08.10:15:44:18
 * @author - @FL03
 * @file - note-card.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// local
import { NoteData } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

type WidgetPropsT = {
  note?: NoteData;
  showDescription?: boolean;
};

/** The `NoteCard` component renders the given **note** as a flexible, card-style component for display. */
export const NoteCard: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Card>, "children"> & WidgetPropsT
> = ({
  className,
  note,
  showDescription,
  ...props
}) => {
  // render a skeleton if no note is provided
  if (!note) {
    logger.warn("NoteCard: No note provided.");
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-1/4" />
          </CardTitle>
          <CardDescription
            className={showDescription ? "not-sr-only" : "sr-only"}
          >
            <Skeleton className="w-3/4" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }
  // destructure the note
  const { title, content, description } = note;
  // render the card
  return (
    <Card
      {...props}
      className={cn(
        "flex flex-1 flex-col",
        className,
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription
            className={showDescription ? "not-sr-only" : "sr-only"}
          >
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
NoteCard.displayName = "NoteCard";

export default NoteCard;
