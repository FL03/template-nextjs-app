/**
 * Created At: 2025-04-04:16:00:40
 * @author - @FL03
 * @description - Scaffold Component
 * @file - scaffold.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
import { AsChild } from '@/types';
// local
import { scaffoldVariants, ScaffoldVariants } from './scaffold-variants';

// Scaffold
export const Scaffold = React.forwardRef<
  HTMLDivElement,
  Readonly<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> &
    ScaffoldVariants & AsChild
>(({ asChild, className, flavor, variant, ...props }, ref) => {
  // declare the slot component
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(scaffoldVariants({ flavor, variant }), className)}
      {...props}
    />
  );
});
Scaffold.displayName = 'Scaffold';

// Scaffold Content
export const ScaffoldContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
    asContainer?: boolean;
    rounded?: boolean;
  }
>(({ className, asChild, asContainer, rounded, ...props }, ref) => {
  // handle asChild
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'flex flex-col flex-1 w-full px-4 py-2 gap-4 lg:gap-6',
        'border-none ring-none',
        asContainer && 'container mx-auto',
        rounded && 'rounded-2xl drop-shadow-2xl shadow-inner',
        className
      )}
      {...props}
    />
  );
});
ScaffoldContent.displayName = 'ScaffoldContent';

// Scaffold Header
export const ScaffoldHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  // handle asChild
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp ref={ref} className={cn('top-0 w-full flex', className)} {...props} />
  );
});
ScaffoldHeader.displayName = 'ScaffoldHeader';

// Scaffold Footer
export const ScaffoldFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  // handle asChild
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'bottom-0 flex flex-shrink items-center w-full min-h-1/12 max-h-1/6 ',
        className
      )}
      {...props}
    />
  );
});
ScaffoldFooter.displayName = 'ScaffoldFooter';

// Scaffold Leading
export const ScaffoldLeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  // handle asChild
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'flex flex-1 flex-shrink-0 flex-col gap-2 mr-auto',
        'h-full max-w-md',
        className
      )}
      {...props}
    />
  );
});
ScaffoldLeading.displayName = 'ScaffoldLeading';

// Scaffold Trailing
export const ScaffoldTrailing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  // handle asChild
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'ml-auto h-full max-w-md flex flex-1 flex-col gap-2',
        className
      )}
      {...props}
    />
  );
});
ScaffoldTrailing.displayName = 'ScaffoldTrailing';
