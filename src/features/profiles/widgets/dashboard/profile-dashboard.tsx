/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
"use client";
// imports
import * as React from "react";
// hooks
import { useProfile } from "@/features/profiles";
import {
  DashboardSection,
  DynamicDashboard,
} from "@/components/common/dashboard";
// local
import { ProfileDashboardLeading } from "./profile-dashboard-leading";
import { ProfileDashboardTrailing } from "./profile-dashboard-trailing";

export const ProfileDashboard: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof DynamicDashboard>,
    "children" | "description" | "title"
  >
> = ({ ref, className, ...props }) => {
  // call the hook to get a reference to the current user profile
  const { profile, username } = useProfile();
  // handle the case where no user profile is found
  if (!profile) return null;
  return (
    <DynamicDashboard
      {...props}
      hideDescription
      ref={ref}
      className={className}
      leading={<ProfileDashboardLeading />}
      trailing={<ProfileDashboardTrailing />}
      title="Profile"
      description={profile?.bio || "No bio available"}
    >
      {username}
    </DynamicDashboard>
  );
};
ProfileDashboard.displayName = "ProfileDashboard";

export default ProfileDashboard;
