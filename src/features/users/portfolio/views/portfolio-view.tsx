/**
 * Created At: 2025.07.05:22:15:37
 * @author - @FL03
 * @file - portfolio-view.tsx
 */
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
// project
import { logger } from '@/lib/logger';
// local
// import { PortfolioDashboard } from '../widgets/portfolio-dashboard';

/** This component renders the portfolio view for the user. */
export const PortfolioView: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';
  //log the event
  const PortfolioDashboard = dynamic(
    async () => await import('../widgets/portfolio-dashboard'),
    {
      ssr: false,
      loading: () => (
        <div className="animate-pulse text-green-400">Loading...</div>
      ),
    }
  );

  return (
    <PortfolioDashboard>
      {children}
      <div className="text-center text-sm text-muted-foreground">
        Current View: {view}
      </div>
    </PortfolioDashboard>
  );
};
