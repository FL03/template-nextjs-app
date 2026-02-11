/**
 * Created At: 2025.07.17:09:16:27
 * @author - @FL03
 * @file - dashboard-scaffold.tsx
 */
'use client';
import * as React from 'react';
import { ClassNames } from '@pzzld/core';
// project
import { cn } from '@/lib/utils';
// local
import {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from './dashboard';
import { DashboardDrawerPanel, DashboardSheetPanel } from './dashboard-panel';
import { DashboardProvider } from './dashboard-provider';

// DashboardHeaderScaffold
export const DashboardHeaderScaffold: React.FC<
  Omit<React.ComponentPropsWithRef<typeof DashboardHeader>, 'title'> & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    hideTitle?: boolean;
    showDescription?: boolean;
    classNames?: ClassNames<'leading' | 'trailing' | 'title' | 'description'>;
  }
> = ({
  ref,
  leading,
  trailing,
  children,
  className,
  title,
  description,
  classNames,
  hideTitle,
  showDescription,
  ...props
}) => (
  <DashboardHeader
    {...props}
    ref={ref}
    className={cn(
      'flex flex-nowrap items-center gap-2 lg:gap-4 pb-2',
      className,
    )}
  >
    {/* Leading */}
    {leading && (
      <div
        className={cn(
          'flex flex-nowrap items-center gap-2 h-full w-fit',
          'left-0 order-first',
          classNames?.leadingClassName,
        )}
      >
        {leading}
      </div>
    )}
    <div className='flex flex-1 flex-col top-0 h-full'>
      {/* Primary */}
      <div className='flex flex-nowrap w-full items-center gap-2 justify-between leading-none tracking-tight'>
        <div className='flex flex-col flex-1 mr-auto'>
          {/* Title */}
          {title && (
            <DashboardTitle
              className={cn(
                hideTitle ? 'sr-only' : 'not-sr-only',
                classNames?.titleClassName,
              )}
            >
              {title}
            </DashboardTitle>
          )}

          {/* Description */}
          {description && (
            <DashboardDescription
              className={cn(
                showDescription ? 'not-sr-only' : 'sr-only',
                classNames?.descriptionClassName,
              )}
            >
              {description}
            </DashboardDescription>
          )}
        </div>
        <div
          className={cn(
            'flex items-center justify-end gap-2 h-full w-fit',
            !trailing && 'hidden',
            classNames?.trailingClassName,
          )}
        >
          {trailing}
        </div>
      </div>
      {children}
    </div>
  </DashboardHeader>
);
DashboardHeaderScaffold.displayName = 'DashboardHeaderScaffold';

/** The `DashboardScaffold` component is a pre-configured dashboard that is intended to be used as a layout with parallel, intercepting routes.*/
export const DashboardScaffold: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Dashboard>, 'title'> &
    React.PropsWithChildren<{
      classNames?: ClassNames<
        | 'content'
        | 'footer'
        | 'layout'
        | 'leading'
        | 'trailing'
        | 'header'
        | 'headerContent'
        | 'headerLeading'
        | 'headerTrailing'
        | 'title'
        | 'description'
      >;
      leading?: React.ReactNode;
      trailing?: React.ReactNode;
      header?: {
        content?: React.ReactNode;
        description?: React.ReactNode;
        title?: React.ReactNode;
        leading?: React.ReactNode;
        trailing?: React.ReactNode;
      };
      compact?: boolean;
      hideDescription?: boolean;
    }>
> = ({
  ref,
  children,
  classNames,
  header,
  leading,
  trailing,
  compact: compact,
  hideDescription,
  ...props
}) => (
  <DashboardProvider compact={!compact}>
    <Dashboard {...props} ref={ref}>
      <DashboardHeaderScaffold
        classNames={{
          leadingClassName: classNames?.headerLeadingClassName,
          trailingClassName: classNames?.headerTrailingClassName,
          titleClassName: classNames?.titleClassName,
          descriptionClassName: classNames?.descriptionClassName,
        }}
        description={header?.description}
        title={header?.title}
        leading={header?.leading}
        trailing={header?.trailing}
        showDescription={hideDescription}
        hidden={!header}
      >
        {header?.content}
      </DashboardHeaderScaffold>
      <DashboardLayout className={classNames?.layoutClassName}>
        {/* Leading */}
        {leading && (
          <DashboardSheetPanel className={classNames?.leadingClassName}>
            {leading}
          </DashboardSheetPanel>
        )}
        {/* Primary View */}
        <DashboardContent className={classNames?.contentClassName}>
          {children}
        </DashboardContent>
        {/* Secondary */}
        {trailing && (
          <DashboardDrawerPanel className={classNames?.trailingClassName}>
            {trailing}
          </DashboardDrawerPanel>
        )}
      </DashboardLayout>
    </Dashboard>
  </DashboardProvider>
);
DashboardScaffold.displayName = 'DashboardScaffold';
