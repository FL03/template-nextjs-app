/**
 * Created At: 2025.07.17:09:05:00
 * @author - @FL03
 * @file - dashboard.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// local
import { useDashboard } from './dashboard-provider';

/** The `Dashboard` component is the basis for a dynamic, responsive, and mobile-friendly dashboard scaffold for the platform.  */
const Dashboard: React.FC<
  React.ComponentPropsWithRef<'div'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard'
      className={cn(
        'relative z-auto flex flex-col flex-1 h-full w-full gap-4 lg:gap-6',
        className,
      )}
    />
  );
};
Dashboard.displayName = 'Dashboard';

/** The `DashboardLayout` component is a wrapper for the main content as well as for both the leading and trailing panels. */
const DashboardLayout: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'data-slot' | 'title'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const { compact } = useDashboard();
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-layout'
      data-state={compact ? 'compact' : 'default'}
      className={cn(
        'relative z-auto flex flex-1 flex-nowrap h-full w-full gap-4 lg:gap-6',
        'group',
        'data-[state=compact]:container data-[state=compact]:mx-auto data-[state=compact]:flex-wrap',
        className,
      )}
    />
  );
};
DashboardLayout.displayName = 'DashboardLayout';

/** The primary display for the dashboard */
const DashboardContent: React.FC<
  React.ComponentPropsWithRef<'div'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-content'
      className={cn(
        'flex flex-col flex-1 h-full w-full gap-4 lg:gap-6',
        className,
      )}
    />
  );
};
DashboardContent.displayName = 'DashboardContent';

const DashboardHeader: React.FC<
  React.ComponentPropsWithRef<'div'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-header'
      className={cn('relative z-auto order-first w-full', className)}
    />
  );
};
DashboardHeader.displayName = 'DashboardHeader';

// DashboardFooter
const DashboardFooter: React.FC<
  React.ComponentPropsWithRef<'div'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-footer'
      className={cn('relative z-auto order-last w-full', className)}
    />
  );
};
DashboardFooter.displayName = 'DashboardFooter';

// DashboardDescription
const DashboardDescription: React.FC<
  React.ComponentPropsWithRef<'span'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-description'
      className={cn(
        'text-muted-foreground line-clamp-2 truncate leading-none tracking-tight',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
    />
  );
};
DashboardDescription.displayName = 'DashboardDescription';

// DashboardTitle
const DashboardTitle: React.FC<
  React.ComponentPropsWithRef<'div'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-title'
      className={cn(
        'text-xl font-semibold leading-none tracking-tight',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
    />
  );
};
DashboardTitle.displayName = 'DashboardTitle';

// DashboardLabel
const DashboardLabel: React.FC<
  React.ComponentPropsWithRef<'div'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-label'
      className={cn(
        'text-base font-semibold leading-none tracking-tight',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
    />
  );
};
DashboardLabel.displayName = 'DashboardLabel';

const DashboardSection: React.FC<
  React.ComponentPropsWithRef<'section'> &
    React.PropsWithChildren<{
      asChild?: boolean;
      scrollable?: boolean;
    }>
> = ({ ref, className, asChild, scrollable, ...props }) => {
  const Comp = asChild ? Slot : 'section';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='dashboard-section'
      className={cn(
        'group relative z-auto flex flex-col flex-1 h-full w-full gap-4 lg:gap-6',
        scrollable && 'overflow-y-auto',
        className,
      )}
    />
  );
};
DashboardSection.displayName = 'DashboardSection';
// -- EXPORTS --
export {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  DashboardFooter,
  DashboardHeader,
  DashboardLabel,
  DashboardLayout,
  DashboardSection,
  DashboardTitle,
};
