/**
 * Created At: 2025.09.15:20:41:48
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - pricing-table.tsx
 */
'use client';
// imports
import * as React from 'react';
import Script from 'next/script';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export const StripePricingTable: React.FC<
  Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'id'> & {
    pricingTableId?: string;
    publishableKey?: string;
  }
> = ({
  className,
  pricingTableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
  publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Render the pricing table widget after the script loads
  const onScriptLoad = React.useCallback(() => {
    if (!pricingTableId) {
      logger.error('Pricing Table ID is not provided.');
      return;
    }
    if (!publishableKey) {
      logger.error('Stripe Publishable Key is not provided.');
      return;
    }
    if (!containerRef.current) {
      logger.error('Container ref is not available.');
      return;
    }
    // Clean up previous widget
    containerRef.current.innerHTML = '';

    const table = document.createElement('stripe-pricing-table');
    table.setAttribute('pricing-table-id', pricingTableId);
    table.setAttribute('publishable-key', publishableKey);
    containerRef.current.appendChild(table);
    logger.trace('Stripe Pricing Table widget rendered.');
  }, [pricingTableId, publishableKey]);
  // unmounting routines
  React.useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <React.Suspense fallback={null}>
      <div
        ref={containerRef}
        id='stripe-pricing-table-container'
        className={cn('flex-1 h-full w-full relative z-auto', className)}
        {...props}
      />
      <Script
        src='https://js.stripe.com/v3/pricing-table.js'
        strategy='afterInteractive'
        onLoad={onScriptLoad}
      />
    </React.Suspense>
  );
};
