/**
 * Created At: 2025.07.17:07:46:12
 * @author - @FL03
 * @file - platform-sidebar.tsx
 */
'use client';
// imports
import * as React from 'react';
import {
  BellIcon,
  BriefcaseBusinessIcon,
  CircleQuestionMarkIcon,
  LayoutDashboardIcon,
  SheetIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// project
import { LogoutButton, useCurrentUser } from '@/features/auth';
import { BillingPortalAction } from '@/features/billing';
import {
  ProfileAvatar,
  ProfileSettingsButton,
  UserProfileCard,
} from '@/features/profiles';
import { cn } from '@/lib/utils';
// components
import { Endpoint } from '@/components/common/endpoint';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { DialogTitle } from '@/components/ui/dialog';
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
} from '@/components/ui/sidebar';
import { ClassNames } from '@pzzld/core';
import ProfileContextMenu from '@/features/profiles/widgets/profile-actions';

type LinkItem = {
  label: string;
  href: React.ComponentProps<typeof Link>['href'];
  icon?: React.ReactNode;
};

/** A custom sidebar trigger for the platform with additional controls */
export const PlatformSidebarTrigger: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'children'> & {
    side?: 'left' | 'right';
    classNames?: ClassNames<'icon' | 'label'>;
  }
> = ({
  ref,
  className,
  classNames,
  disabled,
  side = 'left',
  size = 'icon',
  variant = 'ghost',
  onClick,
  ...props
}) => {
  const { authState } = useCurrentUser();
  // use the sidebar context to get the current sidebar state
  const { open, openMobile, toggleSidebar } = useSidebar();

  const isOpen = React.useMemo(() => open || openMobile, [open, openMobile]);
  // returns a click handler
  function handleOnClick(): React.MouseEventHandler<HTMLButtonElement> {
    return (event) => {
      // cleanup the event
      event.preventDefault();
      event.stopPropagation();
      // toggle the sidebar
      toggleSidebar();
      // call the original onClick function, if it exists
      onClick?.(event);
    };
  }

  return (
    <Button
      {...props}
      autoFocus={false}
      disabled={disabled || !authState.isAuthenticated}
      ref={ref}
      className={cn(
        'items-center justify-center min-w-8',
        'hover:background-blur hover:text-accent-foreground/75',
        className,
      )}
      size={size}
      variant={variant}
      onClick={handleOnClick()}
    >
      {isOpen ? (
        <SidebarCloseIcon
          className={cn(
            'size-4',
            side === 'right' && 'rotate-180',
            classNames?.iconClassName,
          )}
        />
      ) : (
        <SidebarOpenIcon
          className={cn(
            'size-4',
            side === 'right' && 'rotate-180',
            classNames?.iconClassName,
          )}
        />
      )}
      <span
        className={cn(size?.startsWith('icon') ? 'sr-only' : 'not-sr-only')}
      >
        {isOpen ? 'Close' : 'Open'}
      </span>
    </Button>
  );
};

export const PlatformSidebar: React.FC<
  React.ComponentProps<typeof Sidebar>
> = ({
  children,
  className,
  collapsible = 'offcanvas',
  side = 'right',
  variant = 'inset',
  ...props
}) => {
  // hooks
  const router = useRouter();
  const { authState, profile, email, customerId, username } = useCurrentUser();
  const { open, openMobile, state, toggleSidebar } = useSidebar();
  // determine if the sidebar is open or not
  const isOpen = React.useMemo(
    () => open || openMobile || state === 'expanded',
    [open, openMobile, state],
  );

  const generateMenu = ({ links }: { links: LinkItem[] }) => (
    <SidebarMenu>
      {links?.map(({ icon, href, label }, idx) => (
        <SidebarMenuItem key={idx}>
          <SidebarMenuButton asChild>
            <Endpoint
              showLabel
              href={href}
              label={label}
              onClick={() => {
                // close the sidebar
                if (openMobile) toggleSidebar();
              }}
            >
              {icon}
            </Endpoint>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  const linkTree = {
    user: {
      name: 'User',
      links: [
        {
          label: 'Dashboard',
          href: `/${username}/shifts`,
          icon: <LayoutDashboardIcon className='size-4' />,
        },
      ],
    },
    records: {
      name: 'Records',
      links: [
        {
          label: 'Shifts',
          href: {
            pathname: '/shifts',
            query: {
              filterBy: 'all',
              sortBy: 'date:desc',
              view: 'table',
              username,
            },
          },
          icon: <SheetIcon className='size-4' />,
        },
        {
          label: 'Organizations',
          href: {
            pathname: '/orgs',
            query: { username },
          },
          icon: <BriefcaseBusinessIcon className='size-4' />,
        },
      ],
    },
    platform: {
      name: 'Info',
      links: [
        {
          label: 'Help & Support',
          href: '/help',
          icon: <CircleQuestionMarkIcon className='size-4' />,
        },
      ],
    },
  };

  if (!authState.isAuthenticated) return null;
  // render
  return (
    <Sidebar
      {...props}
      draggable
      className={cn('h-full', className)}
      collapsible={collapsible}
      side={side}
      variant={variant}
    >
      <SidebarHeader>
        <ProfileContextMenu>
          <Link
            href={`/${username}`}
            onClick={() => {
              if (openMobile) toggleSidebar();
            }}
          >
            {isOpen ? (
              <UserProfileCard
                compact
                profile={profile}
                className={cn(
                  'bg-radial-[at_25%_25%] from-background to-background/45 to-65%',
                  'transition-opacity duration-200 ease-in-out hover:opacity-80 hover:ring hover:ring-accent/20 hover:ring-inset-0.5',
                )}
              />
            ) : (
              <ProfileAvatar src={profile?.avatar_url} />
            )}
          </Link>
        </ProfileContextMenu>
        {openMobile && <DialogTitle className='sr-only'>Sidebar</DialogTitle>}
      </SidebarHeader>
      {/* Sidebar Content */}
      <SidebarContent className='flex flex-col flex-1 h-full w-full items-center overflow-x-clip'>
        <SidebarGroup className='order-first w-full'>
          <SidebarGroupLabel className='sr-only'>User</SidebarGroupLabel>
          {generateMenu({ links: linkTree.user.links })}
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className='order-2 flex-1 h-full w-full'>
          <SidebarGroupLabel>Records</SidebarGroupLabel>
          <SidebarGroupContent>
            {generateMenu({ links: linkTree.records.links })}
          </SidebarGroupContent>
        </SidebarGroup>
        {/* trailing menu */}
        <div className='order-last flex flex-col h-fit w-full justify-end mt-auto'>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              {generateMenu({ links: linkTree.platform.links })}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Billing</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <BillingPortalAction
                      className='w-full justify-start'
                      variant='ghost'
                      customerEmail={email}
                      customerId={customerId}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter className='flex flex-nowrap items-center justify-center w-full'>
        <ButtonGroup>
          <Button asChild size='icon' variant='outline'>
            <Link
              href={{
                pathname: '/notifications',
                query: {
                  filterBy: 'status:unread',
                  sortBy: 'date:desc',
                  username,
                },
              }}
            >
              <BellIcon className='size-4' />
              <span className='sr-only'>Notifications</span>
            </Link>
          </Button>
          <ProfileSettingsButton
            size='icon'
            variant='outline'
            username={username}
            classNames={{ iconClassName: 'size-4' }}
          />
          <LogoutButton
            classNames={{ iconClassName: 'size-4' }}
            size='icon'
            onSignOut={() => {
              // close the sidebar on mobile
              if (isOpen) toggleSidebar();
              // redirect to the home page
              router.push('/');
            }}
          />
        </ButtonGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
