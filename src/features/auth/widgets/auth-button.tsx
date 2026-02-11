/**
 * Created At: 2025-04-04:19:43:34
 * @author - @FL03
 * @file - auth-button.tsx
 */
'use client';
// imports
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// hooks
import { useAuth } from '@/hooks/use-auth';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { buttonVariants } from '@/components/ui/button';
// local
import { IconButton } from '@/components/common/button';

type WithButtonVariants<T = {}> = T & VariantProps<typeof buttonVariants>;

type ClassNames = {
  labelClassName?: string;
  iconClassName?: string;
};

/** A simple authentication button for managing the user state. */
export const AuthButton: React.FC<
  WithButtonVariants<{
    className?: string;
    classNames?: ClassNames;
    // callbacks
    onError?(error: unknown): void;
    onSignIn?(): void;
    onSignOut?(): void;
  }>
> = ({ onSignIn, onSignOut, ...props }) => {
  const {
    state: { isAuthenticated },
  } = useAuth();
  if (isAuthenticated) {
    return <LogoutButton {...props} onSignOut={onSignOut} />;
  }
  return <LoginButton {...props} onSignIn={onSignIn} />;
};
AuthButton.displayName = 'AuthButton';

// LoginButton
export const LoginButton: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof IconButton>,
    'asChild' | 'onClick' | 'labelClassName' | 'children'
  > & {
    classNames?: ClassNames;
    onError?(error: unknown): void;
    onSignIn?(): void;
  }
> = ({
  ref,
  className,
  classNames,
  size = 'default',
  variant = 'outline',
  onError,
  onSignIn,
  ...props
}) => {
  const router = useRouter();
  return (
    <IconButton
      {...props}
      ref={ref}
      className={cn('transition-colors', className)}
      classNames={{ labelClassName: classNames?.labelClassName }}
      size={size}
      variant={variant}
      onClick={(event) => {
        // cleanup the event
        event.preventDefault();
        event.stopPropagation();
        // trace the event
        logger.trace('Handling the auth button click event...');
        try {
          // use the onSignIn callback before redirecting
          onSignIn?.();
          router.push('/auth/login');
        } catch (error) {
          logger.error({ error }, 'Error signing in...');
          toast.error('Error', {
            description: 'An error occurred during the login',
          });
          if (onError) onError(error);
          throw error;
        }
      }}
    >
      <LogInIcon className={cn('size-4', classNames?.iconClassName)} />
    </IconButton>
  );
};
LoginButton.displayName = 'LoginButton';

export const LogoutButton: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof IconButton>,
    'asChild' | 'children' | 'onClick' | 'labelClassName'
  > & {
    classNames?: ClassNames;
    onError?(error: unknown): void;
    onSignOut?(): void;
  }
> = ({
  ref,
  className,
  classNames,
  size = 'default',
  variant = 'destructive',
  onError,
  onSignOut,
  ...props
}) => {
  // hooks
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <IconButton
      {...props}
      ref={ref}
      className={cn('transition-colors', className)}
      classNames={{ labelClassName: classNames?.labelClassName }}
      size={size}
      variant={variant}
      onClick={async (event: React.BaseSyntheticEvent) => {
        // cleanup the event
        event.preventDefault();
        event.stopPropagation();
        // trace the event
        logger.trace('Handling the auth button click event...');
        try {
          await signOut();
          logger.info('User signed out successfully');
          if (onSignOut) onSignOut?.();
          else router.push('/');
        } catch (error) {
          logger.error({ error }, 'Error signing in...');
          toast.error('Error', {
            description: 'An error occurred during the login',
          });
          if (onError) onError(error);
          throw error;
        }
      }}
      label='Logout'
    >
      <LogOutIcon className={cn('size-4', classNames?.iconClassName)} />
    </IconButton>
  );
};
LogoutButton.displayName = 'LogoutButton';

export default AuthButton;
