// appbar.tsx
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// local
import { useAppbar } from './appbar-provider';
import { appBarVariants, type AppBarVariants } from './appbar-variants';

/** A component designed to run along the top or bottom of the users screen; often used for navigation purposes. */
export const Appbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & AppBarVariants & { asChild?: boolean }
>(
  (
    {
      className,
      asChild = false,
      flavor = 'default',
      position = 'default',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';
    // render the appbar as a context provider to allow for nested appbars
    return (
      <Comp
        ref={ref}
        className={cn(
          appBarVariants({ flavor, position, variant }),
          'gap-2 lg:gap-4 px-4 py-2 z-auto min-h-1/12',
          'ring-none inner-shadow overflow-x-auto inset-0',
          className
        )}
        {...props}
      />
    );
  }
);
Appbar.displayName = 'Appbar';

// AppbarContent
export const AppbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex flex-1 flex-nowrap gap-2 items-center',
        className
      )}
      {...props}
    />
  );
});
AppbarContent.displayName = 'AppbarContent';

// AppbarLeading
export const AppbarLeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'mr-auto inline-flex flex-nowrap gap-2 items-center',
        'max-w-1/3',
        className
      )}
      {...props}
    />
  );
});
AppbarLeading.displayName = 'AppbarLeading';

// AppbarTrailing
export const AppbarTrailing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'ml-auto inline-flex flex-nowrap gap-2 lg:gap-4 items-center justify-end',
        'max-w-1/3',
        className
      )}
      {...props}
    />
  );
});
AppbarTrailing.displayName = 'AppbarTrailing';

// AppbarLogo
export const AppbarLogo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn('h-4 w-4 m-auto border-none ring-none', className)}
      {...props}
    />
  );
});
AppbarLogo.displayName = 'AppbarLogo';

export const AppbarTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { centerTitle } = useAppbar();
  const Comp = asChild ? Slot : 'h1';
  return (
    <Comp
      ref={ref}
      className={cn(
        'font-semibold tracking-tight',
        centerTitle && 'absolute left-1/2 transform -translate-x-1/2',
        className
      )}
      {...props}
    />
  );
});
AppbarTitle.displayName = 'AppbarTitle';

export const AppbarActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn('flex flex-nowrap items-center gap-2 lg:gap-4', className)}
      {...props}
    />
  );
});
AppbarActions.displayName = 'AppbarActions';

// AppbarSection
export const AppbarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'flex flex-row flex-nowrap gap-2 items-center justify-items-center',
        className
      )}
      {...props}
    />
  );
});
AppbarSection.displayName = 'AppbarSection';
