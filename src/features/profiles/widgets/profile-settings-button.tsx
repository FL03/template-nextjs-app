/**
 * Created At: 2025.04.22:13:56:25
 * @author - @FL03
 * @file - profile-settings-button.tsx
 */
"use client";
// imports
import * as React from "react";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClassNames {
  iconClassName?: string;
  labelClassName?: string;
}

export const ProfileSettingsButton: React.FC<
  Omit<React.ComponentProps<typeof Button>, "children"> & {
    about?: string;
    classNames?: ClassNames;
    href?: React.ComponentProps<typeof Link>["href"];
    showLabel?: boolean;
  }
> = ({
  className,
  classNames,
  about = "Profile Settings",
  size = "default",
  variant = "ghost",
  href = {
    pathname: "/settings",
    query: { defaultTab: "profile" },
  },
  ...props
}) => {
  // define a signal to mark if the button is rendered as an icon
  const isIcon = React.useMemo(() => size === "icon", [size]);
  // destructure the classNames
  const { iconClassName, labelClassName } = classNames || {};

  // render the component
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            {...props}
            className={cn("", className)}
            size={size}
            variant={variant}
          >
            <Link
              className="inline-flex flex-nowrap gap-2 items-center"
              href={href}
              about={about}
            >
              <SettingsIcon className={cn("h-4 w-4", iconClassName)} />
              <span
                className={cn(
                  labelClassName,
                  isIcon ? "sr-only" : "not-sr-only",
                )}
              >
                Settings
              </span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Edit your profile
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
ProfileSettingsButton.displayName = "ProfileSettingsButton";

export default ProfileSettingsButton;
