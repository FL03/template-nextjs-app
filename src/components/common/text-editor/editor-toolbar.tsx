/**
 * Created At: 2025.07.11:20:37:52
 * @author - @FL03
 * @file - editor-toolbar.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';

type ToolbarPosition = 'top' | 'bottom';

/** The primary **toolbar** for the `TextEditor` component, providing access to various controls  */
export const TextEditorToolbar: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
    position?: ToolbarPosition;
  }
> = ({ ref, children, className, asChild, position = 'top', ...props }) => {
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-nowrap items-center px-2 py-1 gap-2 overflow-x-auto',
        'rounded-lg border border-muted shadow-inner drop-shadow-sm',
        'bg-accent text-accent-foreground',
        position && `${position}-0`,
        className
      )}
    >
      {children}
    </Comp>
  );
};
TextEditorToolbar.displayName = 'TextEditorToolbar';
