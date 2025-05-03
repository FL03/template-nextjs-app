/**
 * Created At: 2025-04-08:09:48:39
 * @author - @FL03
 * @description - Action Group Component
 * @file - action-group.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';

const actionGroupVariants = cva('flex-nowrap gap-4 lg:gap-6 items-center', {
  defaultVariants: {
    listStyle: 'default',
    variant: 'inline',
  },
  variants: {
    listStyle: {
      default: 'list-none',
    },
    variant: {
      inline: 'inline-flex',
      fullWidth: 'flex flex-1 w-full',
      vertical: 'flex flex-col',
    },
  },
});

type ActionGroupVariants = VariantProps<typeof actionGroupVariants>;

type ActionGroupProps = {
  asChild?: boolean;
} & ActionGroupVariants;

/** An ActionGroup is meant akin to a button group, using a `<ul/>` tag to display its items inline */
export const ActionGroup = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & ActionGroupProps
>(
  (
    { className, listStyle = 'default', variant = 'inline', asChild, ...props },
    ref
  ) => {
    // fallback to a Slot component if asChild is true
    const Comp = asChild ? Slot : 'ul';
    // render the component
    return (
      <Comp
        {...props}
        ref={ref}
        className={cn(actionGroupVariants({ listStyle, variant }), className)}
      />
    );
  }
);
ActionGroup.displayName = 'ActionGroup';

export const ActionGroupItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'li';
  return (
    <Comp
      ref={ref}
      className={cn('inline-flex w-full items-center', className)}
      {...props}
    />
  );
});
ActionGroupItem.displayName = 'ActionButtonItem';

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(
  (
    { asChild, className, size = 'default', variant = 'default', ...props },
    ref
  ) => {
    return (
      <Button
        {...props}
        ref={ref}
        asChild={asChild}
        className={cn(className)}
        size={size}
        variant={variant}
      />
    );
  }
);
ActionButton.displayName = 'ActionButton';
