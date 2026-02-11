/**
 * Created At: 2025.07.26:13:57:45
 * @author - @FL03
 * @file - auth-gate.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// local
import { AuthGate } from '../widgets';

/** The `AuthScreen` view is used to render the auth-gate in a consistent manner. */
export const AuthScreen: React.FC<
  React.ComponentPropsWithoutRef<typeof AuthGate> & { centered?: boolean }
> = ({ centered, defaultView: view = 'login', ...props }) => (
  <div
    className={cn(
      'relative z-auto flex flex-1 flex-nowrap h-dvh w-full items-center',
      centered ? 'justify-center' : 'justify-end',
    )}
  >
    <AuthGate {...props} withTurnstile defaultView={view} />
  </div>
);
AuthGate.displayName = 'AuthGate';
