/**
 * Created At: 2025.10.23:15:03:57
 * @author - @FL03
 * @directory - src/components/common/calendar
 * @file - provider.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';

type SelectedContext<TData> = {
  selected: TData;
  setSelected: React.Dispatch<React.SetStateAction<TData>>;
};

type CalendarContext = SelectedContext<Date> | SelectedContext<Date[]>;

const CalendarContext = React.createContext<CalendarContext | null>(null);

export const useCalendar = () => {
  const context = React.useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<'div'>>
> = ({ ref, className, ...props }) => {
  // initialize the selected state
  const [_selected, _setSelected] = React.useState<Date>(new Date());

  const selected = _selected;
  const setSelected = React.useCallback(_setSelected, [_setSelected]);
  // memoize the context
  const ctx = React.useMemo(
    () => ({ selected, setSelected }),
    [selected, setSelected],
  );
  return (
    <CalendarContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cn('flex-1 h-full w-full', className)}
        {...props}
      />
    </CalendarContext.Provider>
  );
};
CalendarProvider.displayName = 'CalendarProvider';
