/**
 * Created At: 2025.07.18:12:08:08
 * @author - @FL03
 * @file - digital-clock.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// local
import { useClock } from './clock-provider';
import { ClockProps } from './types';

export const DigitalClock: React.FC<
  Omit<React.ComponentPropsWithRef<'span'>, 'children' | 'title'> & ClockProps
> = ({
  ref,
  className,
  onTimeChange,
  locale = 'en-us',
  options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  },
  ...props
}) => {
  // access the context to get the current time
  const { date, timezone } = useClock();
  // ensure the timezone is set
  options.timeZone ??= timezone;
  // render the component
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex flex-nowrap items-center gap-2 p-1',
        'text-nowrap text-base font-mono leading-none tracking-tight',
        className,
      )}
      {...props}
    >
      {date.toLocaleTimeString(locale, options)}
    </span>
  );
};
DigitalClock.displayName = 'DigitalClock';

export default DigitalClock;
