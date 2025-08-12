/**
 * Created At: 2025.07.28:06:38:15
 * @author - @FL03
 * @file - profile-dashboard-leading.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { logger } from "@/lib/logger";
// provider
import { useProfile } from "@/features/profiles";
// components
import { DashboardSection } from "@/components/common/dashboard";
// local
import { ProfileCard } from "../profile-card";
import { ProfileLinks } from "../profile-links";

export const ProfileDashboardLeading: React.FC<
  React.ComponentPropsWithRef<typeof DashboardSection>
> = ({ ref, flavor = "default", variant = "default", ...props }) => {
  // use the profile hook to get the current profile
  const currentUser = useProfile();
  // handle the case where no user profile is found
  if (!currentUser) {
    logger.error("No user profile found");
    return null;
  }
  // deconstruct the hook to get the profile data
  const { profile } = currentUser;
  // render the links section of the profile dashboard
  const renderLinks = () => {
    // handle the case where no socials are available
    if (!profile?.socials || profile.socials.length === 0) {
      return (
        <span className="text-muted-foreground font-semibold italic">
          No links available
        </span>
      );
    }
    // a callback to match each link with a label, if any.
    const createSocialLabel = (item: string) => {
      switch (item) {
        case item.match(/apple\.com/)?.input as string:
          return "Apple";
        case item.match(/meta\.com/)?.input as string:
          return "Facebook";
        case item.match(/github\.com/)?.input as string:
          return "GitHub";
        case item.match(/linkedin\.com/)?.input as string:
          return "LinkedIn";
        default:
          return item;
      }
    };
    // render the `ProfileLinks` component with the socials
    return (
      <ProfileLinks
        links={profile?.socials?.map((social) => ({
          href: social,
          icon: null, // TODO: Add icons for each social link
          label: createSocialLabel(social),
        }))}
      />
    );
  };
  // render the leading section of the profile dashboard
  return (
    <DashboardSection {...props} ref={ref} flavor={flavor} variant={variant}>
      <ProfileCard
        profile={profile}
        className="h-full w-full bg-accent text-accent-foreground"
      >
        {profile?.bio && (
          <span className="text-muted-foreground text-sm text-wrap">
            {profile?.bio}
          </span>
        )}
        <div className="flex flex-col gap-2 w-full mt-3">
          <span className="font-semibold leading-none tracking-tight">
            Links
          </span>
          {renderLinks()}
        </div>
      </ProfileCard>
    </DashboardSection>
  );
};
ProfileDashboardLeading.displayName = "ProfileDashboardLeading";

export default ProfileDashboardLeading;
