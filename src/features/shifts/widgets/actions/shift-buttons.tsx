/**
 * Created At: 2025.10.29:22:26:31
 * @author - @FL03
 * @directory - src/features/shifts/widgets
 * @file - shift-actions.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Edit2Icon, FileOutputIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ClassNames } from '@pzzld/core';
// project
import { useUsername } from '@/hooks/use-username';
import { cn, Downloader } from '@/lib/utils';
// local
import { useWorkSchedule } from '../../providers';
import { type ShiftData } from '../../types';
import { deleteShift } from '../../utils';
// components
import { IconButton, RefreshButton } from '@/components/common/button';
import { Button } from '@/components/ui/button';

export const DeleteShiftButton: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof IconButton>,
    'asChild' | 'children' | 'classNames' | 'onClick'
  > & {
    itemId?: string;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    classNames?: ClassNames<'icon' | 'label'>;
  }
> = ({
  itemId,
  classNames,
  label = 'Delete',
  size = 'default',
  variant = 'destructive',
  ...props
}) => {
  // use the profile provider
  const { username: username } = useUsername();
  // use the router
  const router = useRouter();

  return (
    <IconButton
      {...props}
      label={label}
      classNames={{ labelClassName: classNames?.labelClassName }}
      size={size}
      variant={variant}
      onClick={(event) => {
        // cleanup the event actions
        event.preventDefault();
        event.stopPropagation();
        // wrap the delete action in a promise toast
        toast.promise(
          deleteShift(itemId).then(() => {
            router.push(`/${username}/shifts`);
          }),
          {
            loading: 'Deleting shift...',
            success: 'Shift deleted!',
            error: 'Error deleting shift.',
          },
        );
      }}
    >
      <Trash2Icon className={cn('size-4', classNames?.iconClassName)} />
    </IconButton>
  );
};

export const ShiftLinkButton: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof IconButton>,
    'asChild' | 'children' | 'classNames' | 'label' | 'onClick'
  > & {
    itemId?: string;
    icon?: React.ReactNode;
    mode?: 'read' | 'edit' | 'update';
    classNames?: ClassNames<'icon' | 'label'>;
  }
> = ({
  itemId,
  classNames,
  mode = 'read',
  size = 'default',
  variant = 'secondary',
  ...props
}) => (
  <Button asChild size={size} variant={variant} {...props}>
    <Link
      href={{
        pathname: `/shifts/${itemId}`,
        query: { defaultMode: mode },
      }}
      target='_self'
    >
      <Edit2Icon className={cn('size-4', classNames?.iconClassName)} />
      <span
        className={cn(
          size?.startsWith('icon') ? 'sr-only' : 'not-sr-only',
          classNames?.labelClassName,
        )}
      >
        {['edit', 'update'].includes(mode) ? 'Edit' : 'View'}
      </span>
    </Link>
  </Button>
);

export const RefreshShiftsButton: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof RefreshButton>,
    'isRefreshing' | 'onRefresh'
  >
> = ({ size = 'icon', variant = 'outline', ...props }) => {
  const {
    state: { isReloading },
    reload,
  } = useWorkSchedule();
  return (
    <RefreshButton
      isRefreshing={isReloading}
      onRefresh={reload}
      size={size}
      variant={variant}
      {...props}
    />
  );
};

export const ExportShiftButton: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof IconButton>,
    'asChild' | 'children' | 'classNames' | 'onClick' | 'value'
  > & {
    classNames?: ClassNames<'icon' | 'label'>;
    itemData?: ShiftData | ShiftData[];
    format?: 'json' | 'csv';
  }
> = ({
  classNames,
  disabled,
  itemData,
  label = 'Export as JSON',
  format = 'json',
  size = 'default',
  variant = 'ghost',
  ...props
}) => (
  <IconButton
    disabled={!itemData || disabled}
    classNames={{ labelClassName: classNames?.labelClassName }}
    label={label}
    size={size}
    variant={variant}
    onClick={() => {
      if (!itemData) {
        toast.error('No shift data available for export.');
        return;
      }
      const filename: string =
        itemData instanceof Array
          ? 'shifts-data'
          : `shift-${(itemData as ShiftData).id}`;
      new Downloader(itemData, `${filename}.${format}`).download();
    }}
    {...props}
  >
    <FileOutputIcon className={cn('size-4', classNames?.iconClassName)} />
  </IconButton>
);
