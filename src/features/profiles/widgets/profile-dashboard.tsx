/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { toast } from 'sonner';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { RefreshButton } from '@/components/common/buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// feature-specific
import { useProfile } from '../provider';
import Link from 'next/link';

export const ProfileDashboard: React.FC<
  React.ComponentPropsWithRef<'div'> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
  }
> = ({
  ref,
  children,
  className,
  description,
  title = 'Dashboard',
  ...props
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  // providers
  const { profile, loadProfile } = useProfile();
  description ??= `Welcome @${profile?.username} to your personal digital universe.`;

  const handleOnRefresh = async () => {
    if (!isRefreshing) setIsRefreshing(true);
    try {
      await loadProfile();
    } catch (error) {
      logger.error(error, 'Error refreshing profile dashboard');
      toast.error('Error refreshing profile dashboard', {
        description: 'Please try again later.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  return (
    <div
      {...props}
      ref={ref}
      className={cn('relative h-full w-full', className)}
    >
      <section className="flex flex-row flex-nowrap items-center gap-2 justify-between">
        <div className="inline-flex flex-col flex-1 mr-auto">
          {title && (
            <span className="font-semibold text-lg tracking-tight">
              {title}
            </span>
          )}
          {description && (
            <span className="text-muted-foreground text-sm">{description}</span>
          )}
        </div>
        <div className="inline-flex flex-row flex-nowrap ml-auto items-center gap-4">
          <RefreshButton
            onRefresh={handleOnRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </section>
      <section className="w-full flex flex-1 flex-col min-h-full">
        <div
          className={cn(
            'flex flex-1 flex-wrap w-full min-h-full overflow-hidden',
            'rounded-xl shadow-inner bg-card/75 border border-card/75'
          )}
        >
          {/* Secondary View */}
          <Card className="flex flex-col min-h-full px-4 py-2 sm:w-full md:max-w-md">
            <CardHeader className="flex flex-row flex-nowrap items-center gap-2 justify-between">
              <div className="mr-auto flex flex-wrap gap-2 items-center justify-items-start">
                <CardTitle className="inline-flex gap-2">
                  <span className="text-nowrap font-medium">
                    {profile?.display_name}
                  </span>
                </CardTitle>
                <CardDescription className="text-sm inline-flex flex-nowrap gap-2">
                  <span className="text-sm font-medium text-nowrap">
                    (@{profile?.username})
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-full w-full">
              <div className="inline-flex flex-row flex-nowrap ml-auto items-center gap-2 lg:gap-4">
                <span>{profile?.bio}</span>
              </div>
              <div className="flex flex-col gap-2 w-full mt-3">
                <span className="font-semibold">Socials</span>
                <ul className="flex flex-col gap-2">
                  {profile?.socials?.map((social, idx) => {
                    const url = new URL(social);
                    const handleUrl = (item: string): string => {
                      switch (item) {
                        case item.match(/github\.com/)?.input as string:
                          return 'GitHub';
                        default:
                          return item;
                      }
                    };
                    return (
                      <li
                        key={idx}
                        className="flex flex-row flex-nowrap items-center gap-2"
                      >
                        <Link
                          href={url.href}
                          className={cn(
                            'text-sm text-foreground',
                            'hover:underline hover:text-foreground/75'
                          )}
                        >
                          <span className="not-sr-only">
                            {handleUrl(url.hostname)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardContent>
          </Card>
          {/* Primary View */}
          <Card
            className={cn(
              'flex flex-col flex-1 w-full min-h-full overflow-hidden'
            )}
          >
            {children}
          </Card>
        </div>
      </section>
    </div>
  );
};
ProfileDashboard.displayName = 'ProfileDashboard';

export default ProfileDashboard;
