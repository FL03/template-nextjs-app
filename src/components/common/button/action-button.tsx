/**
 * Created At: 2025.09.25:14:23:07
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - portal-action.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { ClassNames } from '@pzzld/core';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ActionProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  'children' | 'type'
> {
  action?: React.ComponentProps<'form'>['action'];
  icon?: React.ReactNode;
  label?: React.ReactNode;
  params?: Record<string, string | undefined>;
  classNames?: ClassNames<'label'>;
}

export const ActionButton: React.FC<ActionProps> = ({
  action,
  classNames = {},
  params = {},
  icon = <ExternalLinkIcon className='size-4' />,
  label = 'Action',
  size = 'default',
  variant = 'outline',
  ...props
}) => (
  <form action={action} method='POST'>
    {Object.entries(params).map(([key, value], index) => (
      <Input key={index} type='hidden' name={key} value={value} />
    ))}
    <Button type='submit' size={size} variant={variant} {...props}>
      {icon}
      {label && (
        <span
          className={cn(
            size?.startsWith('icon') ? 'sr-only' : 'not-sr-only',
            classNames.labelClassName,
          )}
        >
          {label}
        </span>
      )}
    </Button>
  </form>
);
ActionButton.displayName = 'ActionButton';
