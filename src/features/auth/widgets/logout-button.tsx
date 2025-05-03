/**
 * Created At: 2025-04-04:19:43:34
 * @author - @FL03
 * @description - Auth Button Component
 * @file - auth-button.tsx
 */
'use client';
// imports
import * as React from 'react';
import { LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type AuthButtonProps = {
  className?: string;
  size?: React.ComponentProps<typeof Button>['size'];
  variant?: React.ComponentProps<typeof Button>['variant'];
  isExpanded?: boolean;
  onError?: (error?: any) => void;
  onSuccess?: () => void;
};
// Logout button
export const SignOutButton: React.FC<
  Omit<React.ComponentProps<typeof Button>, 'onClick'> & AuthButtonProps
> = ({
  onError,
  onSuccess,
  className,
  size = 'default',
  variant = 'destructive',
  isExpanded = false,
  ...props
}) => {
  // initialize the client-side supabase client
  const supabase = createBrowserClient();

  const handleOnClick = async (event: React.BaseSyntheticEvent) => {
    // prevent default action
    event.preventDefault();
    // prevent the event from propagating upward
    event.stopPropagation();

    // if user is logged in, sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Error signing out', error);
      toast.error('Error signing out');
      onError?.(error);
      return;
    }
    logger.info('Signed out successfully');
    toast.success('Signed out successfully');
    if (onSuccess) onSuccess();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            className={cn(
              'transition-colors px-2',
              isExpanded && 'justify-start',
              className
            )}
            size={isExpanded ? size : 'icon'}
            variant={variant}
            onClick={handleOnClick}
          >
            <LogOutIcon />
            <span className={isExpanded ? 'not-sr-only' : 'sr-only'}>
              Logout
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign out of your account</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
SignOutButton.displayName = 'SignOutButton';

export default SignOutButton;
