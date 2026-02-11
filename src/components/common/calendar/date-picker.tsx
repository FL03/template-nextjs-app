/**
 * Created At: 2025.09.15:18:38:25
 * @author - @FL03
 * @directory - src/components/common/calendar
 * @file - date-picker.tsx
 */
'use client';
// imports
import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { OnSelectHandler } from 'react-day-picker';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type HandleSelectProps<T = Date> = {
  required?: boolean;
  onDateSelect?: OnSelectHandler<T>;
  selected?: T | null;
};

// DatePicker
export const DatePickerPopover: React.FC<
  Omit<React.ComponentProps<typeof Button>, 'children'> &
    HandleSelectProps<string | Date | number>
> = ({
  className,
  onDateSelect,
  selected: selectedProp = new Date(),
  size = 'default',
  variant = 'outline',
  ...props
}) => {
  const [selected, setSelected] = React.useState<Date | undefined>(
    selectedProp ? new Date(selectedProp) : undefined,
  );

  const handleSelect: OnSelectHandler<Date> = (sel, ...args) => {
    setSelected(new Date(sel));
    onDateSelect?.(sel, ...args);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(
            'flex flex-row items-center justify-start gap-2 lg:gap-4',
            !selected && 'text-muted-foreground',
            className,
          )}
          {...props}
        >
          <CalendarIcon className='size-5' />
          {selected ? (
            new Date(selected)?.toLocaleDateString()
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='flex flex-col shrink w-full'>
        <Calendar
          required
          mode='single'
          selected={selected ? new Date(selected) : undefined}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
DatePickerPopover.displayName = 'DatePickerPopover';

export default DatePickerPopover;
