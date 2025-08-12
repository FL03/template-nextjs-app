/**
 * Created At: 2025.07.17:07:46:12
 * @author - @FL03
 * @file - platform-sidebar.tsx
 */
"use client";
// imports
import * as React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { useRouter } from "next/navigation";
// project
import { LogoutButton, useCurrentUser } from "@/features/auth";
import {
  ProfileAvatar,
  ProfileCard,
  ProfileSettingsButton,
} from "@/features/profiles";
import { WalletButton } from "@/features/web3";
import { LinkProps } from "@/lib/endpoint";
import { appLinksConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
// components
import { ActionGroup, ActionGroupItem } from "@/components/common/action-group";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PlatformSidebar: React.FC<
  React.ComponentProps<typeof Sidebar>
> = ({
  children,
  className,
  collapsible = "icon",
  side = "left",
  variant = "inset",
  ...props
}) => {
  // get the router
  const router = useRouter();
  // get the user profile
  const { profile } = useCurrentUser();
  // setup the sidebar context
  const { open, openMobile, state, toggleSidebar } = useSidebar();
  // determine if the sidebar is open or not
  const isOpen = open || openMobile || state === "expanded";
  // if the user profile is not available, return null
  if (!profile) return null;
  // get the username from the profile
  const username = profile.username;
  // render the sidebar
  return (
    <Sidebar
      {...props}
      className={cn("h-full", className)}
      collapsible={collapsible}
      side={side}
      variant={variant}
    >
      <SidebarHeader>
        <Link href={`/${username}`}>
          {isOpen
            ? (
              <ProfileCard
                compact
                profile={profile}
                className={cn(
                  "border-none bg-radial-[at_25%_25%] from-background to-background/50 to-65% transition-opacity duration-200 ease-in-out",
                  "hover:opacity-80 hover:ring hover:ring-accent/20 hover:ring-inset-0.5",
                )}
              />
            )
            : <ProfileAvatar src={profile.avatar_url} />}
        </Link>
        {openMobile && (
          <VisuallyHidden>
            <DialogTitle>Sidebar</DialogTitle>
          </VisuallyHidden>
        )}
      </SidebarHeader>
      {/* Sidebar Content */}
      <SidebarContent className="flex flex-col flex-1 h-full items-center overflow-x-clip">
        {/* platform */}
        <SidebarNavGroup
          hideTitle
          className="order-first h-fit w-full"
          title="Profile"
          links={appLinksConfig.profile({ username })}
        />
        <SidebarSeparator />
        {/* platform */}
        <SidebarNavGroup
          expand
          className="order-2"
          title="Apps & Services"
          links={appLinksConfig.apps({ username })}
        />
        {/* trailing menu */}
        <div className="order-last inline-flex flex-col w-full justify-end mt-auto">
          <SidebarSeparator />
          <SidebarNavGroup
            title="More"
            links={appLinksConfig.platform({ username })}
          />
          <SidebarSeparator />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <WalletButton
            className="w-full justify-center items-center"
            variant="outline"
          />
        </SidebarMenuButton>
        <div className="flex flex-nowrap items-center justify-center w-full">
          <ActionGroup className="justify-end" flavor="accent">
            <ActionGroupItem asChild>
              <Button asChild size="icon" variant="outline">
                <Link
                  href={{
                    pathname: "/notifications",
                    query: {
                      filterBy: "unread",
                      sortBy: "date",
                      sortOrder: "desc",
                    },
                  }}
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
            </ActionGroupItem>
            <ActionGroupItem asChild>
              <ProfileSettingsButton
                size="icon"
                variant="outline"
                classNames={{ iconClassName: "h-5 w-5" }}
              />
            </ActionGroupItem>
            <ActionGroupItem asChild>
              <LogoutButton
                size="icon"
                onSuccess={() => {
                  // close the sidebar on mobile
                  if (isOpen) toggleSidebar();
                  // redirect to the home page
                  router.push("/");
                }}
              />
            </ActionGroupItem>
          </ActionGroup>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
PlatformSidebar.displayName = "PlatformSidebar";

/**
 * The `SidebarLink` extends the `SidebarMenuItem` component, equipped with additional properties specific to link-related workflows.
 */
const SidebarLink: React.FC<
  React.ComponentProps<typeof SidebarMenuItem> & LinkProps
> = (
  { className, description, disabled, icon, label, href = "#", ...props },
) => {
  const { openMobile, toggleSidebar } = useSidebar();
  return (
    <SidebarMenuItem className={cn("inline-flex flex-1", className)} {...props}>
      <SidebarMenuButton asChild disabled={disabled || !href}>
        <Link
          href={href}
          onClick={() => {
            // close the sidebar on mobile
            if (openMobile) {
              toggleSidebar();
            }
          }}
        >
          {icon}
          <span className="text-foreground">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/**
 * The `SidebarNavGroup` is equipped to render a set of links withing a sidebar, naturally extending the `SidebarGroup` component. It accepts a title and an array of links,
 * each represented by the `LinkProps` type. This component is designed to be flexible, allowing for customization of its appearance and behavior through props such as
 * `className`, `title`, and `links`. The links are rendered using the `SidebarLink` component, ensuring consistency in styling and functionality across the sidebar navigation.
 */
const SidebarNavGroup: React.FC<
  Omit<React.ComponentPropsWithRef<typeof SidebarGroup>, "children"> & {
    title?: React.ReactNode;
    links?: LinkProps[];
    expand?: boolean;
    hideTitle?: boolean;
  }
> = ({ ref, className, title, links = [], expand, hideTitle, ...props }) => {
  // render the component
  return (
    <SidebarGroup
      {...props}
      ref={ref}
      className={cn(
        "flex flex-col w-full",
        expand ? "flex-1 h-full" : "h-fit",
        className,
      )}
    >
      {title && (
        <SidebarGroupLabel className={hideTitle ? "sr-only" : "not-sr-only"}>
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {links?.map((link, idx) => <SidebarLink key={idx} {...link} />)}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default PlatformSidebar;
