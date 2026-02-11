'use client';
// imports
import * as React from 'react';
import Script from 'next/script';
// project
import { logger } from '@/lib/logger';
import { LoaderIcon } from 'lucide-react';

interface TurnstileOptions {
  sitekey: string;
  action?: string;
  callback?: (token: string) => void;
  'error-callback'?: (error: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  tabindex?: number;
  appearance?: 'always' | 'execute' | 'interaction-only';
  size?: 'normal' | 'compact';
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: TurnstileOptions,
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileProps = {
  action?: string;
  siteKey?: string;
  onError?(error: string): void;
  onExpire?(): void;
  onSuccess?(token: string): void;
  onValueChange?(value: string): void;
};

const cloudflareTurnstileSiteKey = (): string | undefined => {
  return (
    process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY ||
    process.env.CF_TURNSTILE_SITE_KEY
  );
};

/** The `CloudflareTurnstile` is a react component for rendering the captcha system from cloudflare. */
export const CloudflareTurnstile: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'id'> & TurnstileProps
> = ({
  ref,
  action = 'submit',
  siteKey = cloudflareTurnstileSiteKey(),
  onError,
  onExpire,
  onSuccess,
  onValueChange,
  ...props
}) => {
  const [widgetId, setWidgetId] = React.useState<string | null>(null);

  const handleOnLoad = React.useCallback(() => {
    if (!siteKey) {
      logger.error(
        'Cloudflare Turnstile site key is not defined. Please set the `NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY` environment variable.',
      );
      return;
    }
    if (!window?.turnstile) {
      logger.error('Cloudflare Turnstile is not loaded.');
      return;
    }
    const id = window.turnstile.render('#cf-turnstile', {
      action,
      sitekey: siteKey,
      callback: (token: string) => onSuccess?.(token),
      'error-callback': (error: string) => onError?.(error),
      'expired-callback': () => onExpire?.(),
    });
    setWidgetId((prev) => {
      if (prev === id) return prev;
      logger.trace('Cloudflare Turnstile widget rendered with id: ' + id);
      onValueChange?.(id);
      return id;
    });
  }, [action, siteKey, onSuccess, onError, onExpire, onValueChange]);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.turnstile && !widgetId) {
      handleOnLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId, handleOnLoad]);

  React.useEffect(() => {
    return () => {
      if (widgetId) {
        window?.turnstile?.remove(widgetId);
      }
    };
  }, [widgetId]);

  return (
    <React.Suspense fallback={<LoaderIcon className='w-4 h-4 animate-spin' />}>
      <div {...props} id='cf-turnstile' ref={ref} />
      <Script
        src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        onLoad={handleOnLoad}
      />
    </React.Suspense>
  );
};

export default CloudflareTurnstile;
