/**
 * Created At: 2025.07.22:19:48:07
 * @author - @FL03
 * @file - profile-card.tsx
 */
"use client";
// imports
import * as React from "react";
import Image from "next/image";
import { type ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { type ProfileData } from "../types";
import { UserProfileStatus } from "./profile-status";
// components
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

/** A component used to render the given user profile */
export const UserProfileCard: React.FC<
  React.ComponentPropsWithRef<typeof Item> & {
    actions?: React.ReactNode;
    profile?: ProfileData | null;
    compact?: boolean;
    showBio?: boolean;
    showStatusLabel?: boolean;
    avatarHeight?: number | `${number}`;
    avatarWidth?: number | `${number}`;
    classnames?: ClassNames<
      "avatar" | "badge" | "content" | "title" | "description"
    >;
  }
> = (
  {
    ref,
    actions,
    children,
    className,
    profile,
    showStatusLabel,
    avatarHeight = 32,
    avatarWidth = 32,
    size = "default",
    variant = "default",
    ...props
  },
) => {
  const isCompact = React.useMemo<boolean>(() => size === "sm", [size]);
  return (
    <Item
      ref={ref}
      className={cn(
        "w-full flex-nowrap",
        className,
      )}
      size={size}
      variant={variant}
      {...props}
    >
      <ItemMedia variant="image">
        <Image
          src={profile?.avatar_url || "profile.png"}
          alt="Profile Avatar"
          height={avatarHeight}
          width={avatarWidth}
          className="rounded-full object-cover"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>@{profile?.username}</ItemTitle>
        <ItemDescription className="text-nowrap truncate line-clamp-1">
          {profile?.display_name}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <UserProfileStatus
          className="order-last"
          status={profile?.status ?? undefined}
          showLabel={showStatusLabel && !isCompact}
        />
        {actions}
      </ItemActions>
    </Item>
  );
};
