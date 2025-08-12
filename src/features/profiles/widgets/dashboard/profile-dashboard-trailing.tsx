/**
 * Created At: 2025.07.28:06:40:42
 * @author - @FL03
 * @file - profile-dashboard-trailing.tsx
 */ "use client";
// imports
import * as React from "react";
// project
import { logger } from "@/lib/logger";
// hooks
import { useProfile } from "@/features/profiles";
// components
import { DashboardSection } from "@/components/common/dashboard";

export const ProfileDashboardTrailing: React.FC<
  React.ComponentPropsWithRef<typeof DashboardSection>
> = ({ ref, flavor = "default", variant = "default", ...props }) => {
  // use the profile hook to get the current profile
  const { profile } = useProfile();
  // handle the case where no user profile is found
  if (!profile) return null;
  // render the leading section of the profile dashboard
  return (
    <DashboardSection {...props} ref={ref} flavor={flavor} variant={variant}>
      User ID: {profile?.id}
    </DashboardSection>
  );
};
ProfileDashboardTrailing.displayName = "ProfileDashboardTrailing";

export default ProfileDashboardTrailing;
