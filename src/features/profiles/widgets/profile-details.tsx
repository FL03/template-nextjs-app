/**
 * Created At: 2025.08.07:10:37:37
 * @author - @FL03
 * @file - profile-details.tsx
 */
"use client";
// imports
import * as React from "react";
// local
import { ProfileCard } from "./profile-card";
import { useProfile } from "../provider";
// components
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/common/section";
import { RefreshButton } from "@/components/common/button";
import { ProfileSettingsButton } from "./profile-settings-button";
import { ListItem, UList } from "@/components/common/list";
import { cn } from "@/lib/utils";

/** This component renders a view of the user's profile providing a detailed summary of their activities and contributions.*/
export const ProfileDetails: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof Section>,
    "asChild" | "children" | "title"
  >
> = ({ className, size = "full", flavor="ghost", variant="container", ...props }) => {
  // providers
  const {
    isOwner,
    state: { isReloading },
    profile,
    reload,
  } = useProfile();
  // a callback for rendering the action(s) for the profile card
  const renderActions = () => {
    if (!isOwner) return null;
    // if the user is the owner, we can render an action button
    return (
      <>
        <RefreshButton
          onClick={reload}
          isRefreshing={isReloading}
        />
        <ProfileSettingsButton />
      </>
    );
  };
  // fallback to null if no profile is available
  if (!profile) {
    return null;
  }
  // render the component
  return (
    <Section
      {...props}
      size="full"
      variant="container"
    >
      <SectionHeader>
        {/* header */}
        <ProfileCard
          showBio
          actions={renderActions()}
          profile={profile}
        />
      </SectionHeader>
      <SectionContent>
        {profile?.email && profile?.email.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="font-semibold tracking-tight leading-none">
              Emails
            </span>
            <UList className="inline-flex flex-wrap gap-2">
              {profile?.email.map((e, index) => (
                <ListItem
                  key={index}
                  className="flex flex-1 flex-nowrap px-2 py-1 hover:cursor-pointer items-center"
                >
                  {e}
                </ListItem>
              ))}
            </UList>
          </div>
        )}
      </SectionContent>
    </Section>
  );
};
ProfileDetails.displayName = "ProfileDetails";

export default ProfileDetails;
