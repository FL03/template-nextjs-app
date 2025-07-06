/**
 * Created At: 2025.07.05:22:16:31
 * @author - @FL03
 * @file - portfolio.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

type PortfolioPropsT = {
  asChild?: boolean;
  className?: string;
};

/** This component renders reports for the users portfolio. */
export const PortfolioDashboard: React.FC<
  React.PropsWithChildren<PortfolioPropsT>
> = ({ asChild, children, className, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  // logger
  logger.trace('Rendering PortfolioDashboard component');
  return (
    <Comp
      {...props}
      className={cn(
        'flex flex-col gap-4 p-4 bg-background text-foreground rounded-lg shadow-md',
        className
      )}
    >
      {children}
    </Comp>
  );
};
PortfolioDashboard.displayName = 'PortfolioDashboard';

export default PortfolioDashboard;
