/**
 * Created At: 2025.07.06:07:02:17
 * @author - @FL03
 * @file - scaffold-provider.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type ScaffoldContext = {
  isMobile: boolean;
};

const ScaffoldContext = React.createContext<ScaffoldContext | null>(null);

export const useScaffold = () => {
  const ctx = React.useContext(ScaffoldContext);
  if (!ctx) {
    throw new Error('useScaffold must be used within a ScaffoldProvider');
  }
  return ctx;
};

// ScaffoldProvider
export const ScaffoldProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & Readonly<React.PropsWithChildren>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();
  // declare the memoized values for the scaffold provider
  const ctx = React.useMemo(() => ({ isMobile }), [isMobile]);
  return (
    <ScaffoldContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cn('flex flex-col flex-1 min-h-full w-full', className)}
        {...props}
      />
    </ScaffoldContext.Provider>
  );
});
ScaffoldProvider.displayName = 'ScaffoldProvider';

export default ScaffoldProvider;