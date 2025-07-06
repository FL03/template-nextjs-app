// appbar.tsx
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// local
import { appBarVariants, type AppBarVariants } from './appbar-variants';

type AppbarContext = {
  centerTitle: boolean;
} & AppBarVariants;

const AppbarContext = React.createContext<AppbarContext>({
  centerTitle: false,
  flavor: 'default',
  variant: 'default',
});

export const useAppbar = (): AppbarContext => {
  const context = React.useContext(AppbarContext);
  if (!context) {
    throw new Error('`useAppbar` must be used within an `AppbarProvider`.');
  }
  return context;
};

// AppbarProvider
export const AppBarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
    centerTitle?: boolean;
  }
>(({ className, asChild = false, centerTitle = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  const ctx = React.useMemo(() => ({ centerTitle }), [centerTitle]);
  // render the appbar as a context provider to allow for nested appbars
  return (
    <AppbarContext.Provider value={ctx}>
      <Comp ref={ref} className={cn('w-full', className)} {...props} />
    </AppbarContext.Provider>
  );
});
AppBarProvider.displayName = 'AppbarProvider';
