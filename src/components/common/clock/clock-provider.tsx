/**
 * Created At: 2025.07.06:07:02:17
 * @author - @FL03
 * @file - time-provider.tsx
 */
"use client";
import { useTime } from "@/hooks/use-time";
// imports
import * as React from "react";

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
      "`useClock` must be used within the bounds of a `ClockProvider`",
    );
  }
  return ctx;
};

type ClockProviderProps = {
  defaultTimeZone?: string;
  refreshRate?: number;
  onTimeChange?: (time: number | string | Date) => void;
  onTimeZoneChange?: (timezone?: string) => void;
};
// TimeProvider
export const ClockProvider: React.FC<
  React.PropsWithChildren<ClockProviderProps>
> = (
  {
    children,
    defaultTimeZone,
    refreshRate = 1000,
    onTimeChange,
    onTimeZoneChange,
  },
) => {
  // get a reference to the current time with the useTime hook
  const { date } = useTime({ refreshRate, onTimeChange });
  // define a state to control the format
  const [_format, _setFormat] = React.useState<string>("HH:mm:ss");
  // define a state to control the timezone
  const [_timezone, _setTimezone] = React.useState<string | undefined>(
    defaultTimeZone,
  );

  const handleTimeZoneChange = React.useCallback(
    (timezone?: string) => {
      _setTimezone(timezone);
      if (onTimeZoneChange) onTimeZoneChange(timezone);
    },
    [],
  );

  // redefine any public variables
  const timezone = _timezone;
  // redeclare public-facing methods
  const setTimezone = handleTimeZoneChange;
  // declare the memoized values for the scaffold provider
  const ctx = React.useMemo(() => ({ date, timezone, setTimezone }), [
    date,
    timezone,
    setTimezone,
  ]);
  // render the TimeProvider component
  return (
    <ClockContext.Provider value={ctx}>
      {children}
    </ClockContext.Provider>
  );
};
ClockProvider.displayName = "ClockProvider";

export default ClockProvider;
