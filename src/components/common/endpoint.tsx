/**
 * Created At: 2025.08.05:17:37:44
 * @author - @FL03
 * @file - endpoint.tsx
 */
'use client';
// imports
import React from 'react';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';

/**
 * The `Endpoint` component is an extension or wrapper over the `Link` element provided by Next.JS pre-configured to support an optional label rendered directly alongside any children
 * (typically an icon) that are passed to the component.
 */
export const Endpoint: React.FC<
  React.ComponentPropsWithRef<typeof Link> &
    React.PropsWithChildren<{
      label?: React.ReactNode;
      showLabel?: boolean;
      reversed?: boolean;
    }>
> = ({
  ref,
  children,
  className,
  href,
  label,
  showLabel,
  reversed,
  ...props
}) => (
  <Link
    {...props}
    ref={ref}
    href={href}
    className={cn(
      'inline-flex flex-nowrap items-center gap-1',
      reversed && 'flex-row-reverse',
      className,
    )}
  >
    {children && <div className='leading-none tracking-tight'>{children}</div>}
    {label && (
      <span className={showLabel ? 'not-sr-only' : 'sr-only'}>{label}</span>
    )}
  </Link>
);
Endpoint.displayName = 'Endpoint';

export const LinkButton: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof Button>,
    'asChild' | 'children' | 'title' | 'onClick'
  > &
    React.PropsWithChildren<{
      label?: React.ReactNode;
      href: React.ComponentProps<typeof Link>['href'];
    }>
> = ({
  ref,
  children,
  href,
  label,
  size = 'default',
  variant = 'link',
  ...props
}) => (
  <Button {...props} asChild ref={ref} size={size} variant={variant}>
    <Endpoint href={href} label={label} showLabel={size !== 'icon'}>
      {children}
    </Endpoint>
  </Button>
);
LinkButton.displayName = 'LinkButton';
