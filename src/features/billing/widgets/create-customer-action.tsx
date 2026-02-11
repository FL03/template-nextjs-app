/**
 * Created At: 2025.10.04:18:56:47
 * @author - @FL03
 * @directory - src/features/billing/widgets
 * @file - customer-actions.tsx
 */
'use client';
// imports
import * as React from 'react';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
// components
import { IconButton } from '@/components/common/button';
// local
import { createCustomerForCurrentUser } from '../utils';

/** Automatically create a customer object on stripe for the current user on-click. */
export const NewCustomerButton: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof IconButton>,
    'children' | 'onClick'
  >
> = ({
  label = 'New Customer',
  size = 'icon',
  variant = 'default',
  ...props
}) => (
  <IconButton
    label={label}
    size={size}
    variant={variant}
    onClick={(event) => {
      // cleanup the event
      event.preventDefault();
      event.stopPropagation();
      // invoke the action
      toast.promise(createCustomerForCurrentUser(), {
        loading: 'Creating customer...',
        success: 'Customer created successfully!',
        error: 'Failed to create customer.',
      });
    }}
    {...props}
  >
    <PlusIcon className='h-5 w-5 ' />
  </IconButton>
);
