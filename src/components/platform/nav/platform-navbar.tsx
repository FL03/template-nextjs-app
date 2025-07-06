/**
 * Created At: 2025.05.05:09:59:14
 * @author - @FL03
 * @file - platform-navbar.tsx
 */
'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';
// components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/ui/navigation-menu';
import { LinkButton } from '@/components/common/nav';

const NavLink: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Link>, 'title'> &
    React.PropsWithChildren<{
      label?: React.ReactNode;
      asTrigger?: boolean;
    }>
> = ({ ref, children, label, asTrigger, ...props }) => {
  return (
    <Link {...props} ref={ref}>
      <NavigationMenuLink
        className={cn('', asTrigger && navigationMenuTriggerStyle())}
      >
        <div className="text-sm font-medium leading-none">{label}</div>
        <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </span>
      </NavigationMenuLink>
    </Link>
  );
};
NavLink.displayName = 'NavLink';

const NavListItem: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Link>, 'title'> &
    React.PropsWithChildren<{
      id?: string | number;
      key?: React.Key;
      label?: React.ReactNode;
    }>
> = ({ ref, id, key, ...props }) => {
  return (
    <li id={id} key={key}>
      <NavLink ref={ref} {...props} />
    </li>
  );
};
NavListItem.displayName = 'ListItem';

export const PlatformNavbar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof NavigationMenu>, 'children'>
> = ({ ref, className, ...props }) => {
  const renderPrimary = () => {
    return (
      <NavigationMenuList>
        <NavigationMenuItem>
          <LinkButton href="/" label="home" />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <LinkButton href="/about" label="about" />
        </NavigationMenuItem>
      </NavigationMenuList>
    );
  };
  // render the component
  return (
    <NavigationMenu
      {...props}
      ref={ref}
      className={cn(
        'inline-flex flex-nowrap items-center justify-start gap-2 lg:gap-4 z-auto',
        className
      )}
    >
      {renderPrimary()}
    </NavigationMenu>
  );
};
PlatformNavbar.displayName = 'PlatformNavbar';

export default PlatformNavbar;
