'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';

type WidgetProps = {
  asChild?: boolean;
};

export const PortalPanel: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & WidgetProps
> = ({ ref, className, children, asChild, ...props }) => {
  const description = "A single place to view and manage all notifications, subscriptions, and digital assets.";
  const title = "Feed";
  // render as a slot whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // render component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn('flex flex-col flex-1 min-h-full w-full gap-4', className)}
    >
      {/* Header */}
      <section className="flex flex-nowrap items-center w-full gap-2 lg:gap-4">
        <div className="inline-flex flex-col items-start w-full gap-2">
          <div className="text-xl font-bold tracking-tight">{title}</div>
          <span className="text-muted-foreground">{description}</span>
        </div>
      </section>
      {/* Content */}
      <section className="flex flex-col flex-1 w-full gap-4 lg:gap-6">
        {children}
      </section>
    </Comp>
  );
};
PortalPanel.displayName = 'PortalPanel';

export default PortalPanel;
