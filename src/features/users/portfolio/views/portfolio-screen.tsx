/**
 * Created At: 2025.05.16:08:13:49
 * @author - @FL03
 * @file - portfolio-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';

type WidgetProps = {
  asChild?: boolean;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

/** The screen component used to display and manage the users portfolio. */
export const PortfolioScreen: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & WidgetProps
> = ({
  ref,
  className,
  description,
  title = 'Portfolio',
  asChild,
  ...props
}) => {
  // handle the asChild state using a Slot component
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-nowrap items-center justify-start flex-1 h-full w-full',
        className
      )}
    >
      <div className="flex flex-col flex-1 w-full h-full">
        <div className="flex flex-col w-full">
          <div className="text-xl font-semibold tracking-tight">{title}</div>
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </div>
      </div>
    </Comp>
  );
};
PortfolioScreen.displayName = 'PortfolioScreen';

export default PortfolioScreen;
