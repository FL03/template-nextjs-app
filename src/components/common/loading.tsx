/**
 * Created At: 2025.10.24:17:23:44
 * @author - @FL03
 * @directory - src/components/common
 * @file - loading.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ClassNames } from '@pzzld/core';
// project
import { cn } from '@/lib/utils';
// components
import { Spinner } from '@/components/ui/spinner';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const LoadingIndicator: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
    showLabel?: boolean;
    classNames?: ClassNames<'icon' | 'label'>;
  }
> = ({ ref, className, classNames, showLabel, ...props }) => (
  <div
    ref={ref}
    data-slot='loading'
    className={cn('inline-flex flex-nowrap gap-2 items-center', className)}
    {...props}
  >
    <Spinner className={cn('size-5', classNames?.iconClassName)} />
    <span
      className={cn(
        'animate-pulse font-semibold transition-colors ease-in-out duration-200',
        showLabel ? 'not-sr-only' : 'sr-only',
        classNames?.labelClassName,
      )}
    >
      Loading
    </span>
  </div>
);
LoadingIndicator.displayName = 'LoadingIndicator';

const LoadingScaffold: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Empty>, 'title'> & {
    classNames?: ClassNames<
      'indicator' | 'title' | 'description' | 'content' | 'header'
    >;
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    hideTitle?: boolean;
  }
> = ({
  ref,
  children,
  className,
  classNames,
  description,
  showDescription,
  title = 'Loading...',
  ...props
}) => (
  <Empty ref={ref} className={cn('w-full', className)} {...props}>
    <EmptyHeader className={cn(classNames?.headerClassName)}>
      <EmptyMedia variant='icon'>
        <Spinner className={cn('size-8', classNames?.indicatorClassName)} />
      </EmptyMedia>
      <EmptyTitle className={cn('animate-pulse', classNames?.titleClassName)}>
        {title}
      </EmptyTitle>
      {description && (
        <EmptyDescription
          className={cn(
            showDescription ? 'not-sr-only' : 'sr-only',
            classNames?.descriptionClassName,
          )}
        >
          {description}
        </EmptyDescription>
      )}
    </EmptyHeader>
    {children && (
      <EmptyContent className={cn('w-full', classNames?.contentClassName)}>
        {children}
      </EmptyContent>
    )}
  </Empty>
);
LoadingScaffold.displayName = 'LoadingScaffold';

export { LoadingIndicator, LoadingScaffold };
