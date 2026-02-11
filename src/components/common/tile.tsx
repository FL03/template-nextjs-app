/**
 * Created At: 2025.10.12:20:52:46
 * @author - @FL03
 * @directory - src/components/common
 * @file - tile.tsx
 */
'use client';
// imports
import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';

const tileVariants = cva(
  'relative z-auto flex flex-nowrap items-center justify-stretch w-full rounded-lg',
  {
    defaultVariants: {
      flavor: 'default',
      size: 'default',
      variant: 'default',
    },
    variants: {
      flavor: {
        default: 'bg-transparent text-foreground border-border',
        accent: 'bg-accent text-accent-foreground border-accent/15',
        card: 'bg-card text-card-foreground border-card/15',
        primary: 'bg-primary text-primary-foreground border-primary/15',
        secondary: 'bg-secondary text-secondary-foreground border-secondary/15',
        destructive:
          'bg-destructive text-destructive-foreground border-destructive/15',
      },
      size: {
        default: 'p-3 gap-2',
        compact: 'shrink h-fit p-1.5 gap-1',
        extended: 'flex-1 h-full p-6 gap-4',
      },
      variant: {
        default: 'border-none',
        outline: 'border',
      },
    },
  },
);

/** The `Tile` is a generic, flexible container for rendering content _inline_. */
export const Tile: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'data-slot' | 'hidden' | 'title'> &
    VariantProps<typeof tileVariants> &
    React.PropsWithChildren<{ asChild?: boolean }>
> = ({
  ref,
  className,
  asChild,
  flavor = 'default',
  size = 'default',
  variant = 'default',
  ...props
}) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile'
      className={cn(tileVariants({ flavor, size, variant }), className)}
    />
  );
};
Tile.displayName = 'Tile';

// TileDescription
export const TileDescription: React.FC<
  Omit<React.ComponentPropsWithRef<'span'>, 'data-slot'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'span';
  // render
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile-description'
      className={cn(
        'text-muted-foreground text-sm leading-snug tracking-tight text-wrap',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
    />
  );
};
TileDescription.displayName = 'TileDescription';

// TileTitle
export const TileTitle: React.FC<
  React.ComponentPropsWithRef<'div'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  // render
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile-title'
      className={cn(
        'font-semibold leading-none tracking-tight text-nowrap',
        className,
      )}
    />
  );
};
TileTitle.displayName = 'TileTitle';

// TileContent
export const TileContent: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile-content'
      className={cn('flex flex-1 flex-col h-full w-full gap-2', className)}
    />
  );
};
TileContent.displayName = 'TileContent';

export const TileHeader: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile-header'
      className={cn('order-first w-full', className)}
    />
  );
};
TileHeader.displayName = 'TileHeader';

export const TileFooter: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile-footer'
      className={cn(
        'order-last flex flex-nowrap items-center w-full gap-2',
        className,
      )}
    />
  );
};
TileFooter.displayName = 'TileFooter';

// TileLeading
export const TileLeading: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile-leading'
      className={cn(
        'inline-flex items-center justify-center shrink h-full w-fit gap-2',
        'oreder-first left-0',
        className,
      )}
    />
  );
};
TileLeading.displayName = 'TileLeading';

// TileTrailing
export const TileTrailing: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> &
    React.PropsWithChildren<{
      asChild?: boolean;
    }>
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      {...props}
      ref={ref}
      data-slot='tile-trailing'
      className={cn(
        'inline-flex shrink item-center justify-end h-full w-fit gap-2',
        'order-last right-0 ml-auto',
        className,
      )}
    />
  );
};
TileTrailing.displayName = 'TileTrailing';
