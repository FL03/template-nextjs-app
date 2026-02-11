/**
 * Created At: 2025.09.21:08:47:51
 * @author - @FL03
 * @directory - src/features/billing/views
 * @file - pricing-page.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// local
import { StripePricingTable } from '../widgets';
// components
import { DetailScaffold } from '@/components/common/details';

type PageProps = {
  tableId?: string;
};
export const PricingPage: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DetailScaffold>, 'children'> &
    PageProps
> = ({
  classNames,
  description = 'View our subscriptions to choose what works best for you!',
  title = 'Pricing',
  tableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
  ...props
}) => {
  return (
    <DetailScaffold
      classNames={{
        contentClassName: cn(
          'p-6 items-center justify-center',
          'bg-white text-black border border-primary/10 rounded-lg shadow-inner drop-shadow-sm',
          classNames?.contentClassName,
        ),
        ...classNames,
      }}
      description={description}
      title={title}
      {...props}
    >
      <StripePricingTable pricingTableId={tableId} />
    </DetailScaffold>
  );
};
PricingPage.displayName = 'PricingPage';

export default PricingPage;
