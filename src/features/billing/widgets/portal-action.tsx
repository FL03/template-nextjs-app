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
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ActionProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  'children' | 'type'
> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  customerId?: string;
  customerEmail?: string;
}

/** A form-component using hidden fields populated by the current user-profile object that is triggered by*/
export const BillingPortalAction: React.FC<ActionProps> = ({
  customerEmail,
  customerId,
  disabled,
  icon = <ExternalLinkIcon className='h-5 w-5' />,
  label = 'Billing Portal',
  size = 'default',
  variant = 'ghost',
  ...props
}) => (
  <form action='/api/stripe/portal' method='POST'>
    {Object.entries({ customerId, customerEmail }).map(([key, value]) => (
      <Input key={key} type='hidden' name={key} value={value} />
    ))}
    <Button
      disabled={disabled || !Boolean(customerId || customerEmail)}
      type='submit'
      size={size}
      variant={variant}
      {...props}
    >
      {icon}
      {label && (
        <span className={size === 'icon' ? 'sr-only' : 'not-sr-only'}>
          {label}
        </span>
      )}
    </Button>
  </form>
);
BillingPortalAction.displayName = 'BillingPortalAction';

export default BillingPortalAction;
