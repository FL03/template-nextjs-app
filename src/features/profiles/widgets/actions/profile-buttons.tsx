/**
 * Created At: 2025.10.23:15:42:49
 * @author - @FL03
 * @directory - src/features/profiles/widgets
 * @file - profile-actions.tsx
 */
"use client";
// imports
import * as React from "react";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
import { useUsername } from "@/hooks/use-username";
//local
import { deleteUserProfile } from "../../utils";
// components
import { IconButton } from "@/components/common/button";
import { Button } from "@/components/ui/button";

export const DeleteUserProfileButton: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof IconButton>,
    "children" | "classNames" | "label" | "onClick"
  > & { classNames?: ClassNames<"icon" | "label">; username?: string }
> = ({ ref, username, classNames: { iconClassName, labelClassName } = {}, ...props }) => (
  <IconButton
    ref={ref}
    variant="destructive"
    classNames={{ labelClassName }}
    onClick={(event) => {
      // clean the event
      event.preventDefault();
      event.stopPropagation();
      // invoke the toast
      toast.promise(deleteUserProfile({ username }), {
        loading: "Deleting profile...",
        success: () => `Profile deleted successfully.`,
        error: (err) => `Error deleting profile: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    }}
    {...props}
  >
    <Trash2Icon className={cn("size-4", iconClassName)} />
  </IconButton>
);

export const UserProfileLinkButton: React.FC<
  & Omit<React.ComponentPropsWithRef<typeof Button>, "children" | "asChild">
  & React.PropsWithChildren<
    {
      label?: React.ReactNode;
      hideLabel?: boolean;
      mode?: "read" | "edit";
      username?: string;
    }
  >
> = (
  {
    ref,
    username,
    mode = "read",
    size = "default",
    variant = "default",
    ...props
  },
) => {
  const { username: currentUsername } = useUsername();
  username ??= currentUsername;
  return (
    <Button asChild ref={ref} size={size} variant={variant} {...props}>
      <Link
        href={{
          pathname: `/${username}`,
          query: {
            defaultMode: mode,
          },
        }}
      >
        <span>{mode === "edit" ? "Edit" : "Visit"}</span>
      </Link>
    </Button>
  );
};
