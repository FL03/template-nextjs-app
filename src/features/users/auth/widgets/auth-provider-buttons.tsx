/*
  Appellation: provider-buttons <widgets>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// imports
import { Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@/lib/supabase';
// components
import {
  GithubIcon,
  GoogleIcon,
  XPlatformLogo,
} from '@/components/common/icons';
import { Button } from '@/components/ui/button';

type ProviderButtonMode = 'sign-in' | 'link' | 'sign-up';

type AuthProviderButtonsProps = {
  inline?: boolean;
  mode?: ProviderButtonMode;
};
/** A set of buttons for signing in or linking with OAuth providers. */
export const AuthProviderButtons: React.FC<
  React.ComponentPropsWithRef<'div'> & AuthProviderButtonsProps
> = ({ ref, className, mode = 'sign-in', inline, ...props }) => {
  // initialize the provider state
  const [scope, setScope] = React.useState<Provider | null>(null);
  // initialize the supabase client
  const supabase = createBrowserClient();
  // handle the OAuth sign-in or link
  const handleOnProviderClicked = (provider: Provider) => {
    return async (event: React.BaseSyntheticEvent) => {
      // prevent the default event action
      event.preventDefault();
      // prevent the event from bubbling up
      event.stopPropagation();
      try {
        // ensure the current scope matches the passed provider
        if (provider !== scope) setScope(provider);

        if (mode === 'sign-in') {
          // handle sign-in
          toast.promise(
            async () => {
              // sign in with the selected provider
              const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
              // handle any errors that occur during sign-in
              if (error) {
                logger.error(
                  'An error occurred when signing in with provider:',
                  error.message
                );
              }
            },
            {
              loading: `Signing in with ${provider}`,
              success: `Signed in with ${provider}`,
              error: `Error authenticating with ${provider}`,
            }
          );
        }
        if (mode === 'link') {
          // handle identity linking
          toast.promise(
            async () => {
              // sign in with the selected provider
              const { error } = await supabase.auth.linkIdentity({
                provider,
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
              // handle any errors that occur during sign-in
              if (error) {
                logger.error(
                  'An error occurred when signing in with provider:',
                  error.message
                );
              }
            },
            {
              loading: `Linking with ${provider}`,
              success: `Successfully linked with ${provider}`,
              error: `Error linking the ${provider} provider`,
            }
          );
        }
      } catch (error) {
        logger.error('Error:', error);
        toast.error('Error', {
          description: 'An error occurred while signing in.',
        });
      } finally {
        setScope(null);
      }
    };
  };

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'gap-2 lg:gap-4',
        inline && 'flex flex-row flex-nowrap items-center',
        !inline && 'flex flex-1 flex-col',
        className
      )}
    >
      <Button
        variant="secondary"
        onClick={handleOnProviderClicked('github')}
        disabled={scope === 'github'}
      >
        <GithubIcon />
        <span className={inline ? 'sr-only' : 'not-sr-only'}>GitHub</span>
      </Button>
      <Button
        variant="secondary"
        onClick={handleOnProviderClicked('google')}
        disabled={scope === 'google'}
      >
        <GoogleIcon />
        <span className={inline ? 'sr-only' : 'not-sr-only'}>Google</span>
      </Button>
      <Button
        variant="secondary"
        onClick={handleOnProviderClicked('twitter')}
        disabled={scope === 'twitter'}
      >
        <XPlatformLogo />
        <span className={inline ? 'sr-only' : 'not-sr-only'}>Twitter</span>
      </Button>
    </div>
  );
};
AuthProviderButtons.displayName = 'AuthProviderButtons';
