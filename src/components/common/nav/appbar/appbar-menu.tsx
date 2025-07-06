// appbar-menu.tsx
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';

/**
 * The appbar menu component is a wrapper for the appbar menu items.
 */
export const AppbarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'ul';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex flex-row flex-nowrap flex-shrink gap-2 lg:gap-4 items-center',
        'bg-inherit text-inherit',
        className
      )}
      {...props}
    />
  );
});
AppbarMenu.displayName = 'AppbarMenu';

export const AppbarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'li';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex flex-row flex-1',
        'bg-inherit text-inherit',
        className
      )}
      {...props}
    />
  );
});
AppbarMenuItem.displayName = 'AppbarMenuItem';
