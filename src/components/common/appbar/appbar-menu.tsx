/**
 * Created At: 2025.07.17:09:27:31
 * @author - @FL03
 * @file - appbar-menu.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';


/** This component is used to render dropdown-menus  */
export const AppBarMenu: React.FC<
  React.ComponentPropsWithRef<'ul'> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` if asChild is true
  const Comp = asChild ? Slot : 'ul';
  // render the component
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
};
AppBarMenu.displayName = 'AppBarMenu';

/** This component is designed to render individual items within the `AppBarMenu` */
export const AppBarMenuItem: React.FC<
  React.ComponentPropsWithRef<'li'> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render the component as a `Slot` if asChild is true
  const Comp = asChild ? Slot : 'li';
  // render the component
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
};
AppBarMenuItem.displayName = 'AppBarMenuItem';
