/**
 * Created At: 2025.07.25:09:24:44
 * @author - @FL03
 * @file - profile-settings.tsx
 */
"use client";
// imports
import * as React from "react";
import Link from "next/link";
import { SettingsIcon } from "lucide-react";
// project
import { AuthProviderButtons } from "@/features/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// local
import { useProfile } from "../provider";
import { AvatarPicker } from "./profile-avatar";
import { ProfileForm } from "./profile-form";
// components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const ProfileSettings: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Card>, "children" | "title"> & {
    username?: string;
    userId?: string;
  }
> = ({ className, username, userId, ...props }) => {
  const isMobile = useIsMobile();
  const { profile } = useProfile();
  if (!profile) return null;
  // render
  return (
    <Card
      className={cn(
        "flex flex-1 flex-col h-full w-full relative z-auto",
        className,
      )}
      {...props}
    >
      <CardContent className="flex-1 h-full w-full">
        <CardHeader>
          <CardTitle className="text-xl">User Settings</CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-1 flex-col gap-2">
          <AvatarPicker defaultImage={profile?.avatar_url} />
          <div className="flex flex-col w-full gap-2">
            <Label className="font-semibold text-base">Providers</Label>
            <AuthProviderButtons
              mode="link"
              className="w-full"
              orientation={isMobile ? "vertical" : "horizontal"}
            />
          </div>
          <Separator />
          <ProfileForm showLegend defaultValues={profile} />
        </CardFooter>
      </CardContent>
    </Card>
  );
};
ProfileSettings.displayName = "ProfileSettings";

export const ProfileSettingsButton: React.FC<
  Omit<React.ComponentProps<typeof Button>, "asChild" | "children"> & {
    about?: string;
    label?: string;
    classNames?: { iconClassName?: string; labelClassName?: string };
    username?: string;
  }
> = ({
  classNames,
  username,
  about = "Profile Settings",
  size = "default",
  variant = "ghost",
  label = "Settings",
  ...props
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...props}
          asChild
          size={size}
          variant={variant}
        >
          <Link
            about={about}
            className="inline-flex flex-nowrap gap-2 items-center"
            href={{
              pathname: `/${username}/settings`,
            }}
            rel="noopener noreferrer"
            target="_self"
          >
            <SettingsIcon
              className={cn("h-5 w-5", classNames?.iconClassName)}
            />
            {label && (
              <span
                className={cn(
                  size === "icon" ? "sr-only" : "not-sr-only",
                  "text-nowrap truncate leading-tight tracking-tight",
                  classNames?.labelClassName,
                )}
              >
                {label}
              </span>
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Edit your profile
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
ProfileSettingsButton.displayName = "ProfileSettingsButton";
