// toolbar/provider.tsx
'use client';
// imports
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
// project
import { cn } from '@/lib/utils';
// local
import { toolbarVariants, type ToolbarVariants } from './toolbar-variants';

type ToolbarContext = {
  centerTitle: boolean;

} & Partial<ToolbarVariants>;

const ToolbarContext = React.createContext<ToolbarContext>({
  centerTitle: false,
});

/** The `useToolbar` creates a new context for its children to share common access with */
export const useToolbar = () => {
  const ctx = React.useContext(ToolbarContext);
  if (!ctx) {
    throw new Error('useToolbar must be used within a ToolbarProvider');
  }
  return ctx;
};

export const ToolbarProvider: React.FC<
  React.PropsWithChildren<Partial<ToolbarContext>>
> = ({ centerTitle = false,  variant, children }) => {
  const ctx = React.useMemo(() => ({ centerTitle, variant, }), [centerTitle, variant,]);
  return (
    <ToolbarContext.Provider value={ctx}>{children}</ToolbarContext.Provider>
  );
};
ToolbarProvider.displayName = 'ToolbarProvider';

export default ToolbarProvider;