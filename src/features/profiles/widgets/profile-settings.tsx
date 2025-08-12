/**
 * Created At: 2025.07.25:09:24:44
 * @author - @FL03
 * @file - profile-settings.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// components
import { Separator } from "@/components/ui/separator";
import { AuthProviderButtons } from "@/features/auth/widgets";
// local
import { AvatarPicker } from "./avatar-picker";
import { ProfileForm } from "./profile-form";
import { ProfileData } from "../types";

export const ProfileSettings: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children" | "title"> & {
    profile?: ProfileData;
  }
> = ({ ref, className, profile, ...props }) => {
  //
  const isMobile = useIsMobile();
  // if no profile is passed, return null
  if (!profile) return null;
  // render the component
  return (
    <div
      {...props}
      ref={ref}
      className={cn("flex flex-1 flex-col gap-2 h-full w-full", className)}
    >
      <AvatarPicker defaultImage={profile.avatar_url} />
      <div className="flex flex-col w-full gap-2">
        <span className="text-lg font-semibold tracking-tight">Providers</span>
        <AuthProviderButtons
          inline={!isMobile}
          mode="link"
          className="w-full"
        />
      </div>
      <Separator className="text-muted" />
      <>
        <span className="text-lg font-semibold tracking-tight">
          Personal Information
        </span>
        <ProfileForm values={profile} />
      </>
    </div>
  );
};
ProfileSettings.displayName = "ProfileSettings";

export default ProfileSettings;
