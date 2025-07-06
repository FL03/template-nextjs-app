// toolbar.tsx
'use client';
// imports
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
// project
import { cn } from '@/lib/utils';
// local
import { ToolbarProvider, useToolbar } from './toolbar-provider';
import { toolbarVariants, type ToolbarVariants } from './toolbar-variants';

// Toolbar
export const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    ToolbarVariants & { centerTitle?: boolean }
>(
  (
    {
      centerTitle = false,
      className,
      variant,
      ...props
    },
    ref
  ) => {


    return (
      <ToolbarProvider centerTitle={centerTitle} variant={variant}>
        <div
          ref={ref}
          className={cn(
            toolbarVariants({ variant }),
            'focus:outline-none',
            'mx-auto',
            className
          )}
          {...props}
        />
      </ToolbarProvider>
    );
  }
);
Toolbar.displayName = 'Toolbar';

export const ToolbarWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toolbarVariants> & { centerTitle?: boolean }
>(
  (
    {
      className,
      variant,
      ...props
    },
    ref
  ) => {

    return (
        <div
          ref={ref}
          className={cn(
            toolbarVariants({ variant }),
            'mx-auto',
            className
          )}
          {...props}
        />
    );
  }
);
ToolbarWrapper.displayName = 'ToolbarWrapper';

// Toolbar Action
export const ToolbarAction = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn('text-center hover:italic transition-colors', className)}
      {...props}
    />
  );
});
ToolbarAction.displayName = 'ToolbarAction';

// Toolbar Action
export const ToolbarActionGroup = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn('inline-flex flex-row flex-nowrap', className)}
      {...props}
    />
  );
});
ToolbarActionGroup.displayName = 'ToolbarActionGroup';

// Toolbar Content
export const ToolbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex flex-row flex-nowrap flex-1 items-center justify-start w-full',
        className
      )}
      {...props}
    />
  );
});
ToolbarContent.displayName = 'ToolbarContent';

export const ToolbarLeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex flex-row flex-nowrap gap-2 items-center justify-items-center mr-auto',
      className
    )}
    {...props}
  />
));
ToolbarLeading.displayName = 'ToolbarLeading';

export const ToolbarTrailing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex flex-row flex-nowrap gap-2 items-center justify-items-center ml-auto',
      className
    )}
    {...props}
  />
));
ToolbarTrailing.displayName = 'ToolbarTrailing';

export const ToolbarTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { centerTitle } = useToolbar();
  return (
    <h1
      ref={ref}
      className={cn(
        'text-lg font-semibold',
        centerTitle && 'absolute left-1/2 transform -translate-x-1/2',
        className
      )}
      {...props}
    />
  );
});
ToolbarTitle.displayName = 'ToolbarTitle';