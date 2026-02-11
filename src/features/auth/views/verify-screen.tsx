/**
 * Created At: 2025.10.20:20:44:29
 * @author - @FL03
 * @directory - src/features/auth/views
 * @file - verification-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const VerificationScreen: React.FC<
  React.ComponentPropsWithRef<'div'>
> = ({ ref, className, ...props }) => {
  return (
    <div ref={ref} className={className} {...props}>
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Verify your email address</CardTitle>
            <CardDescription>
              Please check your email for a verification link to activate your
              account. If you don't see it, be sure to check your spam or junk
              folder.
            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
    </div>
  );
};
VerificationScreen.displayName = 'VerificationScreen';

export const MagicView: React.FC<React.ComponentPropsWithRef<'div'>> = ({
  ref,
  className,
  ...props
}) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-1 min-h-full w-full items-center justify-center',
      className,
    )}
    {...props}
  >
    <Card className='flex flex-col w-full max-w-md'>
      <CardContent>
        <CardHeader>
          <CardTitle>Check your email for the magic link!</CardTitle>
          <CardDescription>
            Please check your email for a magic link to log in. If you don't see
            it, be sure to check your spam or junk folder.
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  </div>
);
MagicView.displayName = 'MagicView';
