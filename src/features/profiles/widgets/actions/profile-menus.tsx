/**
 * Created At: 2025.11.08:12:51:52
 * @author - @FL03
 * @directory - src/features/profiles/widgets/actions
 * @file - profile-menus.tsx
 */
'use client';
import * as React from 'react';
import { BellIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
// project
import { useCurrentUser } from '@/features/auth';
// local

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

/**
 * The `ProfileContextMenu` component is a wrapper that equips the children with a so-called `ContextMenu` triggered
 * whenever a right-click is detected within the bounds of the element.
 */
export const CurrentUserProfileContextMenu: React.FC<
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
            <Link
              className='hover:underline'
              href={{
                pathname: '/notifications',
                query: { filterBy: 'unread', sortBy: 'date' },
              }}
            >
              <BellIcon className='size-4' />
              <span>Notifications</span>
            </Link>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Link
              className='hover:underline'
              href={{ pathname: `/${username}/settings` }}
            >
              <SettingsIcon className='size-4' />
              <span>Settings</span>
            </Link>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuGroup>
          <ContextMenuLabel className='sr-only'>Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={signOut} variant='destructive'>
            <LogOutIcon className='size-4' />
            <span>Logout</span>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
CurrentUserProfileContextMenu.displayName = 'ProfileContextMenu';
