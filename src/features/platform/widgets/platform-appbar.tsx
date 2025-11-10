/**
 * Created At: 2025.07.09:14:04:58
 * @author - @FL03
 * @file - platform-appbar.tsx
 */
"use client";
// imports
import * as React from "react";
import Link from "next/link";
import { BookOpenTextIcon, DollarSignIcon, HomeIcon } from "lucide-react";
// project
import { LoginButton, useCurrentUser } from "@/features/auth";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
// local
import { PlatformSidebarTrigger } from "./platform-sidebar";
// components
import {
  AppBar,
  AppBarContent,
  AppBarLeading,
  AppBarTitle,
  AppBarTrailing,
} from "@/components/common/appbar";
import { PzzldLogo } from "@/components/common/icons";
import { ThemeButton } from "@/components/common/theme";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const PLATFORM_MENU_LINKS: NavItem[] = [
  {
    label: "About",
    href: "/about",
    icon: <HomeIcon className="size-4" />,
  },
  {
    label: "Docs",
    href: "/docs",
    icon: <BookOpenTextIcon className="size-4" />,
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: <DollarSignIcon className="size-4" />,
  },
];

const NavLink: React.FC<
  & Partial<React.ComponentPropsWithoutRef<typeof Link>>
  & React.PropsWithChildren<{
    label?: React.ReactNode;
  }>
> = ({ className, children, label, href = "#", ...props }) => (
  <Link
    {...props}
    className={cn(
      "inline-flex flex-nowrap items-center gap-1 text-base text-nowrap px-2 py-1 rounded-lg",
      "transition-none hover:opacity-80",
    )}
    href={href}
  >
    {children}
    <span className="leading-none tracking-tight" hidden={!label}>
      {label}
    </span>
  </Link>
);

const PlatformNavbar: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenu>,
    "id" | "children"
  >
> = ({ className, ...props }) => (
  <NavigationMenu
    {...props}
    id="platform-navbar"
    className={cn("flex flex-nowrap items-center w-full", className)}
  >
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <NavLink href="/" label="Home">
            <HomeIcon className="size-4" />
          </NavLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger
          autoFocus={false}
          className="items-center justify-center bg-accent text-accent-foreground hover:bg-accent/75 h-8"
        >
          Platform
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid grid-cols-2 grid-flow-rows gap-3 p-4 w-48">
            {PLATFORM_MENU_LINKS.map(({ href, label, icon }, idx) => (
              <li
                key={idx}
                className="col-span-1 w-full"
              >
                <NavigationMenuLink asChild>
                  <NavLink href={href} label={label}>{icon}</NavLink>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

const PlatformBanner: React.FC<
  Partial<React.ComponentPropsWithRef<typeof Link>>
> = ({ ref, className, href = "/", ...props }) => (
  <Link
    {...props}
    ref={ref}
    className={cn(
      "inline-flex items-center flex-nowrap gap-1 p-2",
      "cursor-pointer transition-colors rounded-lg",
      "hover:opacity-80 hover:animate-pulse",
      className,
    )}
    href={href}
  >
    <PzzldLogo className="size-8" />
    <AppBarTitle className="text-xl font-bold sr-only md:not-sr-only">
      pzzld
    </AppBarTitle>
  </Link>
);

/** The primary appbar used throughout the application  */
export const PlatformAppBar: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof AppBar>,
    "asChild" | "id" | "children"
  >
> = ({
  ref,
  className,
  flavor = "accent",
  position = "top",
  ...props
}) => {
  const { authState: { isAuthenticated } } = useCurrentUser();
  return (
    <AppBar
      {...props}
      id="platform-appbar"
      ref={ref}
      flavor={flavor}
      position={position}
    >
      <AppBarLeading>
        <PlatformBanner href="/" />
      </AppBarLeading>
      <AppBarContent asChild>
        <PlatformNavbar />
      </AppBarContent>
      <AppBarTrailing asChild>
        <ButtonGroup>
          <ThemeButton size="icon" variant="ghost" />
          {isAuthenticated
            ? <PlatformSidebarTrigger size="icon" variant="ghost" side="right"/>
            : <LoginButton variant="ghost" />}
        </ButtonGroup>
      </AppBarTrailing>
    </AppBar>
  );
};
PlatformAppBar.displayName = "PlatformAppBar";
