/**
 * Created At: 2025.11.06:13:04:00
 * @author - @FL03
 * @directory - src/components/common
 * @file - text.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';

// Title
export const Title: React.FC<
  React.ComponentPropsWithRef<'div'> & { asChild?: boolean }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='title'
      className={cn(
        'font-semibold leading-tight tracking-tight text-nowrap',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
    />
  );
};
Title.displayName = 'Title';

// Description
export const Description: React.FC<
  React.ComponentPropsWithRef<'span'> & { asChild?: boolean }
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='description'
      className={cn(
        'text-sm text-muted-foreground',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
    />
  );
};
Description.displayName = 'Description';
