/**
 * Created At: 2025.11.07:13:53:11
 * @author - @FL03
 * @directory - src/features/profiles/widgets
 * @file - dashboard.tsx
 */
"use client";
// imports
import * as React from "react";
import { UserCircle2Icon } from "lucide-react";
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
  DashboardDrawerPanel,
  DashboardHeader,
  DashboardLayout,
  DashboardProvider,
  DashboardSection,
  DashboardSheetPanel,
} from "@/components/common/dashboard";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { LoadingScaffold } from "@/components/common/loading";

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
  const { profile, state } = useProfile();

  const Content = () => {
    if (state.isLoading) {
      return <LoadingScaffold description="Loading the user-profile" />;
    } else if (!profile && !state.isLoading) {
      logger.error("No user profile found");
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserCircle2Icon className="size-10" />
            </EmptyMedia>
            <EmptyTitle>No Profile Found</EmptyTitle>
            <EmptyDescription>
              Unable to find any accounts for the user; if this is your account,
              please create a profile to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    } else {
      return (
        <>
          {leading && <DashboardSheetPanel>{leading}</DashboardSheetPanel>}
          {children && <DashboardContent>{children}</DashboardContent>}
          {trailing && <DashboardDrawerPanel>{trailing}</DashboardDrawerPanel>}
        </>
      );
    }
  };
  return (
    <DashboardProvider>
      <Dashboard
        {...props}
        ref={ref}
      >
        <DashboardHeader asChild>
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
          <Content />
        </DashboardLayout>
      </Dashboard>
    </DashboardProvider>
  );
};
ProfileDashboard.displayName = "ProfileDashboard";
