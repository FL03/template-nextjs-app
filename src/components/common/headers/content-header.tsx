import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
//  project
import { cn } from '@/lib/utils';

type ContentHeaderProps = {
  asChild?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

export const ContentHead: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> & ContentHeaderProps
> = ({ ref, leading, trailing, className, description, title, asChild, ...props }) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : 'section';

  // returns true if there is a header to display
  const withHeader: boolean = !!description || !!title;
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-nowrap gap-4 items-center justify-between w-full',
        className
      )}
    >
      {trailing && (
        <div className="inline-flex gap-2 lg:gap-4 items-center justify-start mr-auto">
          {trailing}
        </div>
      )}
      {/* The header */}
      {withHeader && <EntitledHeader description={description} title={title} />}
      {trailing && (
        <div className="inline-flex gap-2 lg:gap-4 items-center justify-end ml-auto">
          {trailing}
        </div>
      )}
    </Comp>
  );
};

/**
 * An _entitiled_ header component is a simple element used to display a title and description.
 */
export const EntitledHeader: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> &
    ContentHeaderProps
> = ({ ref, className, description, title, asChild, ...props }) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex flex-col flex-1 w-full',
        className
      )}
      {...props}
    >
      {title && (
        <div className="font-semibold text-xl tracking-tight">{title}</div>
      )}
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </Comp>
  );
};
EntitledHeader.displayName = 'ContentHeader';

export default EntitledHeader;
