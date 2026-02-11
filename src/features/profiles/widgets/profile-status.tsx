/**
 * Created At: 2025.07.22:19:47:22
 * @author - @FL03
 * @file - profile-status.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORWAYS: Record<string, string> = {
  online: 'bg-lime-500 text-lime-500 border-lime-600',
  active: 'bg-lime-500 text-lime-500 border-lime-600',
  available: 'bg-lime-500 text-lime-500 border-lime-600',
  away: 'bg-amber-500 text-amber-500 border-amber-600',
  idle: 'bg-amber-500 text-amber-500 border-amber-600',
  busy: 'bg-red-500 text-red-500 border-red-600',
  dnd: 'bg-red-500 text-red-500 border-red-600',
  offline: 'bg-gray-500 text-gray-500 border-gray-600',
};

export const UserProfileStatus: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Badge>, 'children'> & {
    status?: string;
    showLabel?: boolean;
  }
> = ({
  ref,
  className,
  showLabel,
  status = 'active',
  variant = 'outline',
  ...props
}) => {
  const userStatusAsColor = <T extends string = string>(
    value?: T | null,
  ): string => {
    if (!value) return STATUS_COLORWAYS['offline'];
    if (!Object.keys(STATUS_COLORWAYS).includes(value.toLowerCase())) {
      return STATUS_COLORWAYS['offline'];
    }
    return STATUS_COLORWAYS[value.toLowerCase()];
  };
  const Indicator = (props: { status?: string } = {}) => (
    <span
      className={cn(
        'rounded-full h-3 w-3 object-cover hover:opacity-90 hover:animate-pulse',
        'border border-transparent transition-all duration-300 ease-in-out',
        userStatusAsColor(props?.status),
      )}
    />
  );
  return (
    <Badge
      {...props}
      ref={ref}
      className={cn('p-2', className)}
      variant={variant}
    >
      <Indicator status={status} />
      <span
        className={cn(
          'text-sm text-muted-foreground',
          showLabel ? 'not-sr-only' : 'sr-only',
        )}
        hidden={!status}
      >
        {status}
      </span>
    </Badge>
  );
};
