'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';
// components
import { ActionGroup, ActionGroupItem } from '@/components/common/action-group';
import {
  Appbar,
  AppbarContent,
  AppbarLeading,
  AppbarTitle,
  AppbarTrailing,
} from '@/components/common/appbar';
import { AppLogo } from '@/components/common/icons';
import { ThemeButton } from '@/components/common/theme';
import { Button } from '@/components/ui/button';

export const PlatformAppBar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Appbar>, 'children'>
> = ({ ref, className, flavor = 'default', variant = 'default', ...props }) => {
  return (
    <Appbar {...props} ref={ref} className={cn('', className)}>
      <AppbarLeading>
        <AppLogo className="h-8 w-8" />
        <AppbarTitle>scsys</AppbarTitle>
      </AppbarLeading>
      <AppbarContent>
        <ActionGroup variant="inline">
          <ActionGroupItem>
            <Button asChild size="sm" variant="link">
              <Link href={{ pathname: '/' }}>
                <span>Home</span>
              </Link>
            </Button>
          </ActionGroupItem>
          <ActionGroupItem>
            <Button asChild size="sm" variant="link">
              <Link href={{ pathname: '/blog' }}>
                <span>Blog</span>
              </Link>
            </Button>
          </ActionGroupItem>
        </ActionGroup>
      </AppbarContent>
      <AppbarTrailing>
        <ActionGroup>
          <ActionGroupItem>
            <ThemeButton />
          </ActionGroupItem>
        </ActionGroup>
      </AppbarTrailing>
    </Appbar>
  );
};
PlatformAppBar.displayName = 'PlatformAppBar';

export default PlatformAppBar;
