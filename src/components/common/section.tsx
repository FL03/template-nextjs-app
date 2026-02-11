/**
 * Created At: 2025.09.28:08:58:35
 * @author - @FL03
 * @directory - src/components/common
 * @file - container.tsx
 */
'use client';
// imports
import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
// lib
import { cn } from '@/lib/utils';

const sectionVariants = cva('flex flex-1 w-full gap-2 lg:gap-4 rounded-xl', {
  defaultVariants: {
    flavor: 'default',
    size: 'default',
    orientation: 'vertical',
    variant: 'default',
  },
  variants: {
    flavor: {
      default: 'bg-transparent text-foreground border-border',
      accent: 'bg-accent text-accent-foreground border-accent/10',
      primary: 'bg-primary text-primary-foreground border-primary/10',
      secondary: 'bg-secondary text-secondary-foreground border-secondary/10',
      destructive:
        'bg-destructive text-destructive-foreground border-destructive',
      surface: 'bg-surface text-surface-foreground border-surface/10',
    },
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    size: {
      default: 'px-4 py-2',
      sm: 'shrink px-3 py-1.5',
      lg: 'grow px-6 py-3',
    },
    variant: {
      default: 'flex-col h-full',
      inline: 'flex-row flex-nowrap items-center',
      container: 'container mx-auto',
    },
  },
});

// Section
export const Section: React.FC<
  Omit<React.ComponentPropsWithRef<'section'>, 'size' | 'title'> &
    VariantProps<typeof sectionVariants> & {
      asChild?: boolean;
      horizontal?: boolean;
      scrollable?: boolean;
    }
> = ({
  ref,
  className,
  asChild,
  horizontal,
  scrollable,
  flavor = 'default',
  orientation = 'vertical',
  size = 'default',
  variant = 'default',
  ...props
}) => {
  const Comp = asChild ? Slot : 'section';
  return (
    <Comp
      ref={ref}
      data-slot='section'
      className={cn(
        sectionVariants({ flavor, orientation, size, variant }),
        horizontal ? 'flex-row' : 'flex-col',
        scrollable && (horizontal ? 'overflow-x-auto' : 'overflow-y-auto'),
        className,
      )}
      {...props}
    />
  );
};
Section.displayName = 'Section';

export const SectionContent: React.FC<
  React.ComponentPropsWithRef<'div'> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot='section-content'
      className={cn('flex flex-col gap-4 w-full', className)}
      {...props}
    />
  );
};
SectionContent.displayName = 'SectionContent';

/** The section header component  */
export const SectionHeader: React.FC<
  React.ComponentPropsWithRef<'div'> & { asChild?: boolean; inline?: boolean }
> = ({ ref, className, asChild, inline, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot='section-header'
      className={cn(
        'flex top-0 w-full gap-2',
        inline && 'flex-row flex-nowrap items-start',
        !inline && 'flex-col',
        className,
      )}
      {...props}
    />
  );
};
SectionHeader.displayName = 'SectionHeader';

export const SectionFooter: React.FC<
  React.ComponentPropsWithRef<'div'> & { asChild?: boolean }
> = ({ ref, asChild, className, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot='section-footer'
      className={cn(
        'bottom-0 w-full flex flex-row flex-nowrap gap-2 items-center',
        className,
      )}
      {...props}
    />
  );
};
SectionFooter.displayName = 'SectionFooter';

export const SectionTitle: React.FC<
  React.ComponentPropsWithRef<'div'> & {
    asChild?: boolean;
  }
> = ({ ref, asChild, className, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      data-slot='section-title'
      className={cn(
        'font-semibold leading-relaxed tracking-tight',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
      {...props}
    />
  );
};
SectionTitle.displayName = 'SectionTitle';

export const SectionDescription: React.FC<
  React.ComponentPropsWithRef<'div'> & {
    asChild?: boolean;
  }
> = ({ ref, asChild, className, hidden, ...props }) => {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      ref={ref}
      data-slot='section-description'
      className={cn(
        'text-sm text-muted-foreground',
        hidden ? 'sr-only' : 'not-sr-only',
        className,
      )}
      {...props}
    />
  );
};
SectionDescription.displayName = 'SectionDescription';
