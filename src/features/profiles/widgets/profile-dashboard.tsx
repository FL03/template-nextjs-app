/**
 * Created At: 2025.11.07:13:53:11
 * @author - @FL03
 * @directory - src/features/profiles/widgets
 * @file - dashboard.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { logger } from "@/lib/logger";
// local
import { useProfile } from "../provider";
import { UserProfileCard } from "./profile-card";
import { ProfileLinks } from "./profile-links";
// components
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardLayout,
  DashboardLeading,
  DashboardProvider,
  DashboardSection,
  DashboardTrailing,
} from "@/components/common/dashboard";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export const ProfileDashboardLeading: React.FC<
  React.ComponentPropsWithRef<typeof DashboardSection>
> = ({ ref, ...props }) => {
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
    <DashboardSection {...props} ref={ref}>
      <UserProfileCard
        profile={profile}
        className="bg-accent text-accent-foreground border-accent/10 border"
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
      </UserProfileCard>
    </DashboardSection>
  );
};

export const ProfileDashboardTrailing: React.FC<
  React.ComponentPropsWithRef<typeof DashboardSection>
> = ({ ref, ...props }) => {
  // hooks
  const { profile } = useProfile();
  // render
  return (
    <DashboardSection {...props} ref={ref}>
      User ID: {profile?.id}
    </DashboardSection>
  );
};

export const ProfileDashboard: React.FC<
  & Omit<
    React.ComponentPropsWithRef<typeof Dashboard>,
    "children" | "description" | "title"
  >
  & React.PropsWithChildren<{
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
  }>
> = ({ ref, children, leading, trailing, ...props }) => {
  // call the hook to get a reference to the current user profile
  const { profile, username } = useProfile();
  // handle the case where no user profile is found
  if (!profile) return null;
  return (
    <DashboardProvider>
      <Dashboard
        {...props}
        ref={ref}
      >
        <DashboardHeader>
          <Item>
            <ItemContent>
              <ItemTitle className="text-xl">Profile Dashboard</ItemTitle>
              <ItemDescription>
                View and manage your profile information, settings, and more!
              </ItemDescription>
            </ItemContent>
          </Item>
        </DashboardHeader>
        <DashboardLayout>
          {leading && <DashboardLeading>{leading}</DashboardLeading>}
          {children && <DashboardContent>{children}</DashboardContent>}
          {trailing && <DashboardTrailing>{trailing}</DashboardTrailing>}
        </DashboardLayout>
      </Dashboard>
    </DashboardProvider>
  );
};
ProfileDashboard.displayName = "ProfileDashboard";
