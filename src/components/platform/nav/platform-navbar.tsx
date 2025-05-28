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
import { Button } from '@/components/ui/button';

const NavButton: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof Button>,
    'asChild' | 'children' | 'title' | 'onClick'
  > &
    React.PropsWithChildren<{
      icon?: React.ReactNode;
      label?: React.ReactNode;
      href: React.ComponentPropsWithRef<typeof Link>['href'];
      asTrigger?: boolean;
    }>
> = ({
  ref,
  children,
  href,
  icon,
  label,
  size = 'sm',
  variant = 'link',
  asTrigger,
  ...props
}) => {
  return (
    <Button {...props} asChild ref={ref} size={size} variant={variant}>
      <Link href={href}>
        {icon && <div className="leading-none">{icon}</div>}
        {label && <span>{label}</span>}
      </Link>
    </Button>
  );
};
NavButton.displayName = 'NavButton';

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

const ListItem: React.FC<
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
ListItem.displayName = 'ListItem';

export const PlatformNavbar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof NavigationMenu>, 'children'>
> = ({ ref, className, ...props }) => {
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
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavButton href="/" label="Home" />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavButton href="/about" label="about" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
PlatformNavbar.displayName = 'PlatformNavbar';

export default PlatformNavbar;
