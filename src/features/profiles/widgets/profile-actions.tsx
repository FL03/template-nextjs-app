/**
 * Created At: 2025.10.23:15:42:49
 * @author - @FL03
 * @directory - src/features/profiles/widgets
 * @file - profile-actions.tsx
 */
'use client';
// imports
import * as React from 'react';
import { BellIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
// project
import { useCurrentUser } from '@/features/auth';
import { cn } from '@/lib/utils';
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

const MenuLink: React.FC<
  React.ComponentPropsWithRef<typeof Link> &
    React.PropsWithChildren<{ label?: React.ReactNode; hideLabel?: boolean }>
> = ({ ref, children, className, href, label, hideLabel, ...props }) => (
  <Link
    {...props}
    ref={ref}
    href={href}
    className={cn('inline-flex flex-nowrap items-center gap-1', className)}
  >
    {children}
    {label && (
      <span
        className={cn(
          'leading-snug tracking-tight',
          hideLabel ? 'sr-only' : 'not-sr-only',
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
  React.ComponentPropsWithRef<typeof ContextMenuTrigger>
> = ({ ref, ...props }) => {
  const { username, signOut } = useCurrentUser();
  // render the component
  return (
    <ContextMenu>
      <ContextMenuTrigger ref={ref} {...props} />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel className='sr-only'>Navigation</ContextMenuLabel>
          <ContextMenuItem asChild>
            <MenuLink
              label='Notifications'
              href={{
                pathname: '/notifications',
                query: { filterBy: 'unread', sortBy: 'date' },
              }}
            >
              <BellIcon className='size-4' />
            </MenuLink>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <MenuLink label='Settings' href={`/${username}/settings`}>
              <SettingsIcon className='size-4' />
            </MenuLink>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuGroup>
          <ContextMenuLabel className='sr-only'>Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={signOut} variant='destructive'>
            <LogOutIcon className='size-4' />
            <span>Logout</span>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
ProfileContextMenu.displayName = 'ProfileContextMenu';

export default ProfileContextMenu;
