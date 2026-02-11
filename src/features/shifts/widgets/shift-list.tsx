/**
 * Created At: 2025.09.11:15:57:41
 * @author - @FL03
 * @file - shift-list.tsx
 */
'use client';
// packages
import * as React from 'react';
import { compareAsc, compareDesc } from 'date-fns';
import { formatAsCurrency } from '@pzzld/core';
// project
import { cn } from '@/lib/utils';
// local
import { useWorkSchedule } from '../providers';
import { type ShiftData } from '../types';
import { ShiftItemContextMenu, ShiftItemDropdownMenu } from './actions';
// components
import { Checkbox } from '@/components/ui/checkbox';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

export const ShiftListItem: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Item>, 'asChild'> & {
    value: ShiftData;
  }
> = ({ ref, value, className, size = 'sm', variant = 'default', ...props }) => {
  const { id, date, tips_cash = 0, tips_credit = 0 } = value;
  return (
    <ShiftItemContextMenu asChild itemId={id}>
      <Item
        ref={ref}
        className={cn('w-full', className)}
        size={size}
        variant={variant}
        {...props}
      >
        <ItemMedia variant='icon'>
          <Checkbox className='size-4' />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className='text-right'>
            {new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
          </ItemTitle>
        </ItemContent>
        <ItemContent className=''>
          <ItemTitle className='text-left font-mono'>
            {formatAsCurrency(tips_cash + tips_credit)}
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          {/* actions menu */}
          <ShiftItemDropdownMenu item={value} />
        </ItemActions>
      </Item>
    </ShiftItemContextMenu>
  );
};

export const ShiftList: React.FC<
  React.ComponentPropsWithoutRef<typeof ItemGroup> & {
    itemCount?: number;
    descending?: boolean;
    scrollable?: boolean;
  }
> = ({ className, descending, scrollable, itemCount = 5, ...props }) => {
  // initialize providers
  const { data: shifts } = useWorkSchedule();

  function handleShifts(
    values: ShiftData[],
    { ascending, limit }: { ascending?: boolean; limit?: number } = {},
  ) {
    // sort the items by date
    values = values.sort(({ date: lhs }, { date: rhs }) => {
      return ascending ? compareAsc(lhs, rhs) : compareDesc(lhs, rhs);
    });

    if (limit) values = values.slice(0, limit);

    return values;
  }

  const data = React.useMemo<ShiftData[]>(
    () => handleShifts(shifts, { ascending: !descending, limit: itemCount }),
    [shifts, descending, itemCount],
  );

  return (
    <ItemGroup
      className={cn('w-full', scrollable && 'overflow-y-auto', className)}
      {...props}
    >
      {data?.map((item, index) => (
        <ShiftListItem key={item.id ?? index} value={item} />
      ))}
    </ItemGroup>
  );
};
ShiftList.displayName = 'ShiftList';
