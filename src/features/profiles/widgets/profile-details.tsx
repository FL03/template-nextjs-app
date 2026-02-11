/**
 * Created At: 2025.08.07:10:37:37
 * @author - @FL03
 * @file - profile-details.tsx
 */
'use client';
// imports
import * as React from 'react';
import { UserRoundPlusIcon, UserRoundXIcon } from 'lucide-react';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';
// local
import { UserProfileCard } from './profile-card';
import { ProfileSettingsButton } from './profile-settings';
import { useProfile } from '../provider';
// components
import { RefreshButton } from '@/components/common/button';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Item, ItemGroup } from '@/components/ui/item';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

/** This component renders a view of the user's profile providing a detailed summary of their activities and contributions.*/
export const ProfileDetails: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'asChild' | 'children' | 'title'>
> = ({ ref, className, ...props }) => {
  // providers
  const { state, isOwner, profile, reload, ...userProfile } = useProfile();
  // a callback for rendering the action(s) for the profile card
  const renderActions = () => (
    <ButtonGroup>
      <RefreshButton onRefresh={reload} isRefreshing={state.isReloading} />
      <ProfileSettingsButton size='icon' username={profile?.username} />
    </ButtonGroup>
  );
  // fallback to null if no profile is available
  if (state.isLoading) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Spinner className='size-8' />
          </EmptyMedia>
          <EmptyTitle className='animate-pulse'>Loading profile...</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }
  if (!profile && !state.isLoading) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <UserRoundXIcon className='size-10' />
          </EmptyMedia>
          <EmptyTitle>No profile found</EmptyTitle>
          <EmptyDescription>
            This user does not have a profile yet.
          </EmptyDescription>
          <EmptyContent>
            <Button asChild variant='link'>
              <Link href='/auth/register'>
                <UserRoundPlusIcon className='size-4' />
                <span>Register</span>
              </Link>
            </Button>
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    );
  }
  if (userProfile.error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <UserRoundXIcon className='size-10' />
          </EmptyMedia>
          <EmptyTitle>Failed to load profile</EmptyTitle>
          <EmptyDescription>
            An error occurred while fetching the profile data. Please try again
            later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>{userProfile.error.message}</EmptyContent>
      </Empty>
    );
  }

  // render the component
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'relative z-auto flex flex-1 flex-col h-full w-full',
        className,
      )}
    >
      <div className='flex flex-col w-full pb-4 gap-2'>
        {/* header */}
        <UserProfileCard
          variant='muted'
          actions={isOwner && renderActions()}
          profile={profile}
        />
        <span className='tracking-tight leading-normal' hidden={!profile?.bio}>
          {profile?.bio}
        </span>
      </div>
      <div className='flex flex-1 flex-col w-full'>
        <section
          id='contact-section'
          className='flex flex-col gap-1'
          hidden={!profile?.emails || profile?.emails.length === 0}
        >
          <span className='font-semibold tracking-tight leading-none'>
            Contact
          </span>
          <ItemGroup>
            {profile?.emails.map((e, index) => (
              <Item
                key={index}
                className='flex flex-1 flex-nowrap px-2 py-1 items-center cursor-pointer'
              >
                <span
                  className={cn(
                    'text-sm font-medium leading-none tracking-tight',
                    '',
                  )}
                >
                  {e}
                </span>
              </Item>
            ))}
          </ItemGroup>
        </section>
      </div>
    </div>
  );
};
ProfileDetails.displayName = 'ProfileDetails';

export default ProfileDetails;
