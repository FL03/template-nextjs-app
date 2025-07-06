// toolbar-ext.tsx
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';

type ToolbarInputProps = {
  key?: string;
  placeholder?: string;
};

// ToolbarInput
export const ToolbarInput = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement> & ToolbarInputProps
>(({ className, key, placeholder, ...props }, ref) => {
  return (
    <input
      key={key}
      ref={ref}
      className={cn(
        'bg-primary-foreground text-primary rounded-md transition-colors',
        'h-fit max-w-xs my-auto px-2 py-1',
        'hover:bg-blend-color hover:border-accent focus:border-accent',
        className
      )}
      placeholder={placeholder ?? 'Search...'}
      {...props}
    />
  );
});
ToolbarInput.displayName = 'ToolbarInput';
