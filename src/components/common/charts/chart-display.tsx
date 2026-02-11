/**
 * Created At: 2025.11.20:00:30:58
 * @author - @FL03
 * @directory - src/components/common/charts
 * @file - chart-item.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ClassNames } from '@pzzld/core';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// components
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';

export const ChartContainer: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot='chart-container'
      className={cn(
        'relative z-auto flex flex-1 flex-col h-full w-full',
        className,
      )}
      {...props}
    />
  );
};

export const ChartContent: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot='chart-content'
      className={cn('flex-1 h-full w-full', className)}
      {...props}
    />
  );
};
ChartContent.displayName = 'ChartContent';

export const ChartHeader: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot='chart-header'
      className={cn('order-first py-4 w-full', className)}
      {...props}
    />
  );
};

export const ChartTitle: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'font-semibold text-nowrap',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
      {...props}
    />
  );
};

export const ChartDescription: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'text-muted-foreground text-sm truncate line-clamp-2',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
      {...props}
    />
  );
};

export const ChartDisplay: React.FC<
  React.ComponentPropsWithRef<typeof ChartContainer> & {
    classNames?: ClassNames<
      | 'action'
      | 'chart'
      | 'content'
      | 'description'
      | 'header'
      | 'footer'
      | 'title'
    >;
    actions?: React.ReactNode;
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    hideTitle?: boolean;
  }
> = ({
  ref,
  actions,
  children,
  classNames,
  hideTitle,
  showDescription,
  description = 'Visualize your earned tips over time!',
  title = 'Tips Over Time',
  ...props
}) => (
  <ChartContainer ref={ref} {...props}>
    <ChartHeader asChild>
      <Item className={cn('flex-nowrap', classNames?.headerClassName)}>
        <ItemContent
          className='flex-1 w-full'
          hidden={(!description && !title) || hideTitle}
        >
          {title && (
            <ItemTitle
              className={cn(
                'text-lg leading-none tracking-tight',
                hideTitle ? 'sr-only' : 'not-sr-only',
                classNames?.titleClassName,
              )}
            >
              {title}
            </ItemTitle>
          )}
          {description && (
            <ItemDescription
              className={cn(
                'leading-none tracking-tight line-clamp-2 truncate',
                classNames?.descriptionClassName,
                showDescription ? 'not-sr-only' : 'sr-only',
              )}
            >
              {description}
            </ItemDescription>
          )}
        </ItemContent>
        {actions && (
          <ItemActions className={cn(classNames?.actionClassName)}>
            {actions}
          </ItemActions>
        )}
      </Item>
    </ChartHeader>
    {children && (
      <ChartContent className={classNames?.contentClassName}>
        {children}
      </ChartContent>
    )}
  </ChartContainer>
);
ChartDisplay.displayName = 'ChartDisplay';
