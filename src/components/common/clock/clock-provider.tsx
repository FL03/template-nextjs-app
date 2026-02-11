/**
 * Created At: 2025.07.06:07:02:17
 * @author - @FL03
 * @file - time-provider.tsx
 */
'use client';
// imports
import * as React from 'react';

type ClockContext = {
  date: Date;
  timezone?: string;
  setTimezone: (timezone?: string) => void;
};

const ClockContext = React.createContext<ClockContext | null>(null);

/**
 * Access the context of the `TimeProvider` component.
 */
export const useClock = (): ClockContext => {
  const ctx = React.useContext(ClockContext);
  if (!ctx) {
    throw new Error(
      '`useClock` must be used within the bounds of a `ClockProvider`',
    );
  }
  return ctx;
};

type RefreshRate = 'seconds' | 'minutes' | number;

const resolveRefreshRate = (rate: RefreshRate): number => {
  const unit = 1000; // 1 second in milliseconds
  // check if the rate is a number
  if (typeof rate === 'number') {
    if (rate <= 0) {
      throw new Error('Refresh rate must be a positive number greater than 0');
    }
    return rate;
  }
  switch (rate) {
    case 'seconds':
      return unit;
    case 'minutes':
      return 60 * unit;
    default:
      throw new Error(
        `Invalid refresh rate: ${rate}. Must be 'seconds', 'minutes', or a positive number.`,
      );
  }
};

// TimeProvider
export const ClockProvider: React.FC<
  React.PropsWithChildren<{
    defaultTimeZone?: string;
    refreshRate?: number;
    onTimeChange?: (time: number | string | Date) => void;
    onTimeZoneChange?: (timezone?: string) => void;
  }>
> = ({
  children,
  defaultTimeZone,
  refreshRate = 1000,
  onTimeChange,
  onTimeZoneChange,
}) => {
  // initialize a reference to the interval
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  // setup the time state
  const [_dateTime, _setDateTime] = React.useState<Date>(() => new Date());
  // handle any changes to the time
  const handleTimeChange = React.useCallback(
    (time: number | string | Date) => {
      _setDateTime((prev) => {
        const v = new Date(time);
        if (prev === v) return prev;
        onTimeChange?.(v);
        return v;
      });
    },
    [onTimeChange],
  );
  // update the time every `refreshInterval` milliseconds
  React.useLayoutEffect(() => {
    // if an interval is already running, do nothing
    if (intervalRef.current) return;
    // otherwise, set up a new interval
    else {
      const epoch = resolveRefreshRate(refreshRate);
      intervalRef.current = setInterval(
        () => handleTimeChange(Date.now()),
        epoch,
      );
    }
    // handle cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [_dateTime, intervalRef, refreshRate, handleTimeChange]);
  // define a state to control the format
  const [_format, _setFormat] = React.useState<string>('HH:mm:ss');
  // define a state to control the timezone
  const [_timezone, _setTimezone] = React.useState<string | undefined>(
    defaultTimeZone,
  );

  const handleTimeZoneChange = React.useCallback((timezone?: string) => {
    _setTimezone(timezone);
    if (onTimeZoneChange) onTimeZoneChange(timezone);
  }, []);
  // declare the memoized values for the scaffold provider
  const ctx = React.useMemo(
    () => ({ date: _dateTime, timezone: _timezone, setTimezone: _setTimezone }),
    [_dateTime, _timezone, _setTimezone],
  );
  // render the TimeProvider component
  return <ClockContext.Provider value={ctx}>{children}</ClockContext.Provider>;
};
ClockProvider.displayName = 'ClockProvider';

export default ClockProvider;
