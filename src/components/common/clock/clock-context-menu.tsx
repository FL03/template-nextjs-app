/**
 * Created At: 2025.08.06:16:55:01
 * @author - @FL03
 * @file - clock-context-menu.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
// local
import { useClock } from './clock-provider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {} from '@radix-ui/react-select';

type SelectItemData = {
  key: string;
  value: string;
};

const SelectTimeZone: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof Select>,
    'children' | 'value' | 'onValueChange'
  > & {
    className?: string;
  }
> = ({ className, defaultValue, ...props }) => {
  // define available timezones
  const timezones: SelectItemData[] = [];
  // access the current context
  const { timezone, setTimezone } = useClock();
  // ensure the defaultValue is set
  defaultValue ??= timezone;
  // render the select component
  return (
    <Select
      {...props}
      value={timezone}
      onValueChange={(value) => {
        setTimezone(value);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder='Select Timezone' />
      </SelectTrigger>
      <SelectContent
        defaultValue={defaultValue}
        className={cn('inline-flex flex-col w-fit min-w-24', className)}
      >
        <SelectGroup>
          <SelectLabel>Timezones</SelectLabel>
          {timezones.map((tz, index) => (
            <SelectItem key={index} value={tz.value}>
              {tz.key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const ClockContextMenu: React.FC<
  React.ComponentPropsWithoutRef<typeof ContextMenu> & { className?: string }
> = ({ children, className, ...props }) => {
  // access the current context
  const { setTimezone } = useClock();

  // handle the timezone change
  const handleTimezoneChange = (timezone: string) => {
    // update the timezone in the context
    setTimezone(timezone);
  };

  return (
    <ContextMenu {...props}>
      <ContextMenuTrigger className={cn('h-fit w-fit', className)}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className='w-48'>
        <ContextMenuGroup>
          <ContextMenuLabel>Controls</ContextMenuLabel>
          <ContextMenuItem>
            <SelectTimeZone />
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
ClockContextMenu.displayName = 'ClockContextMenu';

export default ClockContextMenu;
