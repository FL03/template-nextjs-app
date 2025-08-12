/**
 * Created At: 2025-04-09:16:53:00
 * @author - @FL03
 * @file - spinner.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Loader2Icon } from 'lucide-react';
// project
import { cn } from '@/lib/utils';
// feature-specific
import { AnimatedLabel } from './label';
import { loaderVariants, LoaderVariants } from './variants';

export const SpinnerIcon: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Loader2Icon>, 'size' | 'title'> & LoaderVariants
> = ({
  className,
  ref,
  anim = 'default',
  flavor = 'default',
  size = 'default',
  variant = 'default',
  ...props
}) => {
    return (
      <Loader2Icon
        ref={ref}
        className={cn(
          loaderVariants({
            anim,
            flavor,
            size,
            variant,
          }),
          className
        )}
        {...props}
      />
    );
  };
SpinnerIcon.displayName = 'SpinnerIcon';

/** A loader component */
export const Spinner: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
    label?: string;
    showLabel?: boolean;
    className?: string;
    classNames?: {
      iconClassName?: string;
      labelClassName?: string;
    };
  }
> = ({
  ref,
  className,
  showLabel,
  classNames = {},
  label = 'Loading...',
  ...props
}) => {
    // deconstruct the classNames
    const { iconClassName, labelClassName } = classNames;
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex flex-nowrap items-center gap-2',
          className
        )}
        {...props}
      >
        <Loader2Icon className={cn('h-8 w-8 animate-spin', iconClassName)} />
        {showLabel && (
          <span className={cn("font-semibold text-foreground text-2xl leading-none text-nowrap animate-pulse", labelClassName)}>
            {label}
          </span>
        )}
      </div>
    );
  };
Spinner.displayName = 'Spinner';

export const DashedCircleLoader = React.forwardRef<
  SVGSVGElement,
  React.ComponentProps<'svg'>
>(({ className, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      className={cn('animate-spin h-5 w-5 text-white', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v1m0 14v1m8.66-10.66l-.707.707M6.34 17.66l-.707.707M4 12h1m14 0h1m-2.34-6.34l-.707.707M6.34 6.34l-.707-.707"
      />
    </svg>
  );
});
DashedCircleLoader.displayName = 'DashedCircleLoader';

export default Spinner;
