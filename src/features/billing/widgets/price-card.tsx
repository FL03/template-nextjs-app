/**
 * Created At: 2025.09.19:09:20:54
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - product-card.tsx
 */
'use client';
// imports
import * as React from 'react';
import { formatAsCurrency } from '@pzzld/core';
// project
import { usePrice } from '@/hooks/use-price';
import { cn } from '@/lib/utils';
// local
import { CustomCheckoutAction } from './checkout-action';
// components
import { PzzldLogo } from '@/components/common/icons';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * The `ProductPrice` component is used to render the cost of a particular product; if provided, an interval will be
 * automatically rendered next to the cost of the item.
 */
export const ProductPrice: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> & {
    cost?: number | `${number}`;
    currency?: string;
    interval?: string;
  }
> = ({ ref, className, cost, interval, currency = 'usd', ...props }) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'inline-flex flex-nowrap items-center text-nowrap gap-1',
        className,
      )}
    >
      <span className='font-mono text-lg font-semibold'>
        {formatAsCurrency(cost, { currency })}
      </span>
      {interval && (
        <span className='text-muted-foreground'>per {interval}</span>
      )}
    </div>
  );
};
/** The `PriceCard` component renders an actionable product item using a payment link id to engage the `stripe` api. */
export const PriceCard: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Card>, 'title'> &
    React.PropsWithChildren<{
      priceId?: string;
      lookupKey?: string;
      description?: React.ReactNode;
      title?: React.ReactNode;
      showDescription?: boolean;
      classNames?: {
        descriptionClassName?: string;
        titleClassName?: string;
        actionClassName?: string;
        contentClassName?: string;
        headerClassName?: string;
        footerClassName?: string;
      };
    }>
> = ({
  children,
  className,
  lookupKey = 'pzzld_org_tips_monthly',
  priceId,
  showDescription,
  classNames = {},
  description = 'A tip tracker equipped with various analytical tools to help you manage your tips and earnings.',
  title = 'Tip Tracker',
  ...props
}) => {
  const { data } = usePrice({ lookupKey, priceId });
  const cost = data?.unit_amount ? data.unit_amount / 100 : undefined;
  return (
    <Card
      className={cn(
        'flex flex-1 flex-col w-full gap-2 max-w-sm relative z-auto',
        className,
      )}
      {...props}
    >
      <div className='order-first w-full'>
        <PzzldLogo className='h-24 w-24 m-auto' />
      </div>
      <CardContent
        className={cn(
          'order-last flex flex-1 flex-col h-full w-full',
          classNames?.contentClassName,
        )}
      >
        <CardHeader className={classNames?.headerClassName}>
          <CardTitle
            className={cn('text-2xl text-nowrap', classNames?.titleClassName)}
          >
            {title}
          </CardTitle>
          <CardDescription className={classNames?.descriptionClassName}>
            <ProductPrice
              cost={cost}
              currency={data?.currency ?? 'usd'}
              interval={data?.recurring?.interval}
            />
          </CardDescription>
          <CardAction>
            <CustomCheckoutAction
              priceId={data?.id}
              className={classNames?.actionClassName}
              label='Subscribe'
            />
          </CardAction>
        </CardHeader>
        {children && (
          <CardFooter
            className={cn(
              'flex flex-col w-full gap-2',
              classNames?.footerClassName,
            )}
          >
            {children}
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
};
PriceCard.displayName = 'PriceCard';
