/**
 * Created At: 2025.08.08:09:39:41
 * @author - @FL03
 * @file - use-time.tsx
 */
"use client";
// imports
import * as React from "react";

type RefreshRateT = "seconds" | "minutes" | number;

const resolveRefreshRate = (rate: RefreshRateT): number => {
  const unit = 1000; // 1 second in milliseconds
  // check if the rate is a number
  if (typeof rate === "number") {
    if (rate <= 0) {
      throw new Error("Refresh rate must be a positive number greater than 0");
    }
    return rate;
  } else {
    switch (rate) {
      case "seconds":
        return unit;
      case "minutes":
        return 60 * unit;
      default:
        throw new Error(
          `Invalid refresh rate: ${rate}. Must be 'seconds', 'minutes', or a positive number.`,
        );
    }
  }
};

type UseTimeOptions = {
  refreshRate?: RefreshRateT;
  onTimeChange?: (data: number | string | Date) => void;
};

type UseTimeReturnT = {
  date: Date;
};

type UseTimeT = (options: UseTimeOptions) => UseTimeReturnT;

/**
 * The `useTime` hook provides a way to access the current date and time, updating it regularly based on the given refresh rate.
 * @param options - The options for the hook
 * @returns - An object containing the current date and time
 */
export const useTime: UseTimeT = (
  { refreshRate = "seconds", onTimeChange },
) => {
  // initialize a reference to the interval
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  // setup the time state
  const [value, setValue] = React.useState<Date>(() => new Date());
  // handle any changes to the time
  const handleTimeChange = React.useCallback((time: number | string | Date) => {
    // parse the timestamp into a compatible data object
    const parsedDate = new Date(time);
    // update the time state
    setValue(parsedDate);
    // if provided, invoke the onTimeChange callback
    if (onTimeChange) onTimeChange(parsedDate);
    // finish
    return;
  }, [onTimeChange]);
  // create a new interval
  const createInterval = React.useCallback((): NodeJS.Timeout => {
    // resolve the refresh rate
    const epoch = resolveRefreshRate(refreshRate);
    //
    return setInterval(() => handleTimeChange(Date.now()), epoch);
  }, [refreshRate, handleTimeChange]);
  // update the time every `refreshInterval` milliseconds
  React.useLayoutEffect(() => {
    // if no interval exists, create one
    if (!intervalRef.current) {
      intervalRef.current = createInterval();
    }
    // handle cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [value, intervalRef, createInterval]);
  // redeclare public variables
  const date = value;
  // declare the memoized values for the scaffold provider
  return React.useMemo(() => ({ date }), [date]);
};
