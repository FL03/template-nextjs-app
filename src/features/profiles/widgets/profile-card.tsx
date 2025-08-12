/**
 * Created At: 2025.07.22:19:48:07
 * @author - @FL03
 * @file - profile-card.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// local
import { ProfileAvatar } from "./profile-avatar";
import { ProfileContextMenu } from "./profile-context-menu";
import { ProfileStatusBadge } from "./profile-status";
import { Profile } from "../types";
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderLeading,
  HeaderTitle,
  HeaderTrailing,
} from "@/components/common/header";

/** The profile card component */
export const ProfileCard: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    actions?: React.ReactNode;
    profile?: Profile | null;
    compact?: boolean;
    showBio?: boolean;
  }
> = (
  { ref, actions, children, className, profile, compact, showBio, ...props },
) => {
  //  if there is no profile, return null
  if (!profile) return null;
  // destructure the profile object
  const {
    avatar_url,
    bio,
    display_name,
    status,
    username,
  } = profile;
  // determines whether to show the bio
  const withBio = showBio && bio;
  // render the component
  return (
    <ProfileContextMenu>
      <div
        ref={ref}
        className={cn(
          "flex flex-col w-full px-4 py-2 gap-2",
          "bg-accent text-accent-foreground border border-accent/10 rounded-lg",
          "drop-shadow-sm shadow-inner inset-0.5",
          "transition-all duration-300 ease-in-out",
          className,
        )}
        {...props}
      >
        <Header>
          <HeaderLeading>
            <ProfileAvatar src={avatar_url} className="left-0 mr-auto" />
          </HeaderLeading>
          <HeaderContent>
            <HeaderTitle textSize="base">@{username}</HeaderTitle>
            <HeaderDescription className="text-nowrap truncate" textSize="sm">
              {display_name}
            </HeaderDescription>
          </HeaderContent>
          <HeaderTrailing>
            <ProfileStatusBadge
              status={status ?? undefined}
              showLabel={!compact}
            />
            {actions}
          </HeaderTrailing>
        </Header>
        {!compact && (
          <>
            {withBio && (
              <span className="line-clamp-2 leading-snug tracking-tight text-wrap text-sm text-muted-foreground">
                {bio}
              </span>
            )}
            {children}
          </>
        )}
      </div>
    </ProfileContextMenu>
  );
};
ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
