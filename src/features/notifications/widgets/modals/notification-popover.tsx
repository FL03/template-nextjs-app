/**
 * Created At: 2025.11.08:15:34:25
 * @author - @FL03
 * @directory - src/features/notifications/widgets/modals
 * @file - notification-popover.tsx
 */
'use client';
// imports
import * as React from 'react';
// local
import { NotificationData } from '../../types';
import { NotificationCard } from '../notification-card';
// components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const NotificationPopover: React.FC<
  React.ComponentPropsWithoutRef<typeof Popover> &
    React.PropsWithChildren<{ value?: NotificationData | null }>
> = ({ children, value, ...props }) => (
  <Popover {...props}>
    {children && <PopoverTrigger asChild>{children}</PopoverTrigger>}
    <PopoverContent>
      <NotificationCard value={value} />
    </PopoverContent>
  </Popover>
);
