/**
 * Created At: 2025.07.17:09:49:23
 * @author - @FL03
 * @file - title.tsx
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
import { TextSize } from '@/types';

/** A standard widget for _descriptive_ elements of the ui. */
export const Description: React.FC<
  React.ComponentPropsWithRef<'span'> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, textSize = 'sm', ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'span';
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'text-muted-foreground',
        textSize && `text-${textSize}`,
        className
      )}
    />
  );
};
Description.displayName = 'Description';

/** A standard _title_ element for the interface  */
export const Title: React.FC<
  React.ComponentPropsWithRef<'div'> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, textSize = 'lg', ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'font-semibold text-nowrap leading-none tracking-tight',
        textSize && `text-${textSize}`,
        className
      )}
    />
  );
};
Title.displayName = 'Title';