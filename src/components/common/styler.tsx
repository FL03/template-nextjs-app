/**
 * Created At: 2025.11.10:11:46:54
 * @author - @FL03
 * @directory - src/components/common
 * @file - styler.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';

interface LocaleNumberDisplayProps {
  value?: number | `${number}`;
  locale?: Intl.LocalesArgument;
  format?: Intl.NumberFormatOptions['style'];
  options?: Omit<Intl.NumberFormatOptions, 'style' & keyof this>;
}

export const LocaleNumberDisplay: React.FC<
  React.ComponentPropsWithRef<'span'> & LocaleNumberDisplayProps
> = ({
  ref,
  className,
  value = 0,
  locale = 'en-us',
  format = 'currency',
  options: { currency = 'USD', maximumFractionDigits = 2, ...options } = {},
  ...props
}) => (
  <span ref={ref} className={cn('font-mono text-nowrap', className)} {...props}>
    {new Intl.NumberFormat(locale, {
      maximumFractionDigits,
      style: format,
      ...options,
    }).format(value ? Number(value) : 0)}
  </span>
);
LocaleNumberDisplay.displayName = 'LocaleNumberDisplay';
