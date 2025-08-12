/**
 * Created At: 2025.08.05:17:33:46
 * @author - @FL03
 * @file - profile-context-menu.tsx
 */
"use client";
// imports
import * as React from "react";
import { BellIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
// project
import { AuthButton } from "@/features/auth";
import { cn } from "@/lib/utils";
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const MenuLink: React.FC<
  & React.ComponentPropsWithRef<typeof Link>
  & React.PropsWithChildren<{ label?: React.ReactNode; hideLabel?: boolean }>
> = (
  { ref, children, className, href, label, hideLabel, ...props },
) => (
  <Link
    {...props}
    ref={ref}
    href={href}
    className={cn("inline-flex flex-nowrap items-center gap-1", className)}
  >
    {children}
    {label && (
      <span
        className={cn(
          "leading-snug tracking-tight",
          hideLabel ? "sr-only" : "not-sr-only",
        )}
      >
        {label}
      </span>
    )}
  </Link>
);

/**
 * The `ProfileContextMenu` component is a wrapper that equips the children with a so-called `ContextMenu` triggered
 * whenever a right-click is detected within the bounds of the element.
 */
export const ProfileContextMenu: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  // render the component
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel className="sr-only">Navigation</ContextMenuLabel>
          <ContextMenuItem>
            <MenuLink
              label="Notifications"
              href={{
                pathname: "/notifications",
                query: { filterBy: "unread", sortBy: "date" },
              }}
            >
              <BellIcon className="w-4 h-4" />
            </MenuLink>
          </ContextMenuItem>
          <ContextMenuItem>
            <MenuLink
              label="Settings"
              href={{ pathname: "/settings", query: { defaultTab: "profile" } }}
            >
              <SettingsIcon className="w-4 h-4" />
            </MenuLink>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuItem>
            <AuthButton />
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
ProfileContextMenu.displayName = "ProfileContextMenu";

export default ProfileContextMenu;
