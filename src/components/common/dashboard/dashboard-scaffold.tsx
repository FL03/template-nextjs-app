// dashboard.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// hooks
// import { useIsMobile } from '@/hooks/use-mobile';
// project
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';


const dashboardContentVariants = cva('gap-4 lg:gap-6 overflow-auto px-4 py-2', {
  defaultVariants: {
    flavor: 'default',
    variant: 'default',
  },
  variants: {
    flavor: {
      default: 'rounded-none border-none ring-none',
      card: 'rounded-2xl bg-card text-card-foreground border border-muted shadow-sm',
    },
    variant: {
      default: 'flex flex-col flex-1 w-full',
    },
  },
});

/**
 * A collection of classNames that are passed to their corresponding components within the `DashboardScaffold` component.
 * @param {string} contentClassName - pass a className to the content wrapper
 * @param {string} panelClassName - pass a className to the panel wrapper
 */
export type DashboardClassNames = {
  contentClassName?: string;
  panelClassName?: string;
};

/** This component defines the scaffolding used to manage the dynamics of the various dashboard views. */
export const DashboardScaffold: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> &
    React.PropsWithChildren & {
      classes?: DashboardClassNames;
      panel?: React.ReactNode;
      asChild?: boolean;
      showPanel?: boolean;
    }
> = ({
  ref,
  className,
  children,
  panel,
  asChild,
  classes = {},
  showPanel,
  ...props
}) => {
  // destructure the classNames object
  const { contentClassName, panelClassName } = classes;
  // fallback onto a Slot component if asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-1 flex-wrap overflow-hidden h-full w-full',
        'gap-4 lg:gap-6 mt-2 lg:mt-4 z-auto',
        className
      )}
    >
      {/* Secondary */}
      {showPanel && (
        <DashboardPanel className={cn('', panelClassName)}>
          {panel}
        </DashboardPanel>
      )}
      {/* Primary View */}
      <DashboardDisplay
        withSecondary={!!panel}
        className={cn('', contentClassName)}
      />
    </Comp>
  );
};

/** This component streamlines the implementation of various views, ensuring the widget expands to fill the bounds of its parent element. */
export const DashboardContent: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    asChild?: boolean;
    showHeader?: boolean;
  } & VariantProps<typeof dashboardContentVariants>
> = ({
  ref,
  children,
  className,
  description,
  title,
  flavor = 'default',
  variant = 'default',
  asChild,
  showHeader = false,
  ...props
}) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // determine if the header should be shown
  const withHeader: boolean = showHeader && !!(title || description);
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        dashboardContentVariants({ flavor, variant }),
        className
      )}
    >
      {/* Header */}
      <section className="flex flex-nowrap w-full items-center justify-between top-0">
        {withHeader && (
          <div className="flex flex-col flex-1 w-full gap-2 lg:gap-4">
            {title && (
              <div className="text-xl font-bold tracking-tight">{title}</div>
            )}
            {description && (
              <span className="text-muted-foreground text-sm">
                {description}
              </span>
            )}
          </div>
        )}
      </section>
      {/* Content */}
      <section className="flex flex-nowrap items-center w-full gap-2 lg:gap-4">
        {children}
      </section>
    </Comp>
  );
};
DashboardContent.displayName = 'DashboardContent';

/** The primary display for the dashboard */
export const DashboardDisplay: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
    withSecondary?: boolean;
    side?: 'left' | 'right';
  }
> = ({ ref, className, asChild, withSecondary, side = 'right', ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col flex-1 h-full w-full overflow-auto gap-4 lg:gap-6',
        side && `${side}-0`,
        withSecondary && 'lg:max-w-2/3',
        className
      )}
    />
  );
};
DashboardDisplay.displayName = 'DashboardDisplay';

/** The `DashboardPanel` describes the optional, dynamic secondary display often used when constructing dashboards. */
export const DashboardPanel: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col flex-shrink-0 px-4 py-2',
        'gap-4 lg:gap-6 h-fit lg:h-full w-full lg:max-w-1/3 left-0 top-0',
        className
      )}
    />
  );
};
DashboardPanel.displayName = 'DashboardPanel';
