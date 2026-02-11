/**
 * Created At: 2025.10.22:21:06:27
 * @author - @FL03
 * @directory - src/features/auth/widgets/forms
 * @file - passwordless-form.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Loader2Icon, LogInIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const passwordlessSchema = z.object({
  email: z
    .email({ error: 'A valid email address is required to login' })
    .refine((arg) => arg.trim().length > 0),
  captchaToken: z.string().optional(),
  emailRedirectTo: z.string().optional(),
  redirectTo: z.string().optional(),
});

type PasswordlessSchema = z.infer<typeof passwordlessSchema>;

export const PasswordlessLoginForm: React.FC<
  Omit<
    React.ComponentPropsWithRef<'form'>,
    'id' | 'action' | 'children' | 'method' | 'onSubmit'
  > & {
    captchaToken?: string;
    defaultValues?: Partial<PasswordlessSchema>;
    values?: PasswordlessSchema;
    showLegend?: boolean;
    beforeSubmit?: () => void;
    onCancel?: () => void;
    onSuccess?: () => void;
  }
> = ({
  ref,
  className,
  captchaToken,
  defaultValues,
  values,
  showLegend,
  beforeSubmit,
  onCancel,
  onSuccess,
  ...props
}) => {
  const router = useRouter();
  // initialize the form state
  const supabase = createBrowserClient();

  const emailRedirect = new URL('/auth/callback', window.location.origin);
  const redirectUrl = new URL('/', window.location.origin);
  // define the form using the hook
  const form = useForm<PasswordlessSchema>({
    resolver: zodResolver(passwordlessSchema),
    defaultValues,
    values,
  });
  // handle form submissions
  const handleOnSubmit = (event: React.BaseSyntheticEvent) => {
    // cleanup the event
    event.preventDefault();
    event.stopPropagation();
    if (beforeSubmit) beforeSubmit();
    // handle the form submission
    logger.trace('Submitting the passwordless login form...');
    return toast.promise(
      form.handleSubmit(async (formData) => {
        const { email, captchaToken, emailRedirectTo } = formData;
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            captchaToken,
            emailRedirectTo,
          },
        });
        if (error) throw new Error(error.message);
        logger.info(`Passwordless login email sent to ${formData.email}`);
        return data;
      })(event),
      {
        loading: 'Sending magic link...',
        error: (err) => {
          const error =
            err instanceof Error ? err : new Error('An unknown error occurred');
          logger.error(error, error.message);
          return `Error sending magic link: ${error.message}`;
        },
        success: () => {
          if (onSuccess) onSuccess();
          form.reset();
          router.push('/auth/magic');
          return 'Magic link sent! Check your email.';
        },
      },
    );
  };

  return (
    <form
      {...props}
      ref={ref}
      id='passwordless-form'
      className={cn('w-full', className)}
      onSubmit={handleOnSubmit}
      onKeyDown={async (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          // process the form submission
          event.currentTarget.requestSubmit();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          // handle the cancel action
          logger.trace('Cancelling the passwordless login form...');
          if (onCancel) onCancel();
          form.reset();
        }
      }}
    >
      <FieldSet form='passwordless-form'>
        <FieldLegend
          className={cn('text-xl', showLegend ? 'not-sr-only' : 'sr-only')}
        >
          Login
        </FieldLegend>
        <FieldDescription
          className={cn(showLegend ? 'not-sr-only' : 'sr-only')}
        >
          Get a magic link to login to your account
        </FieldDescription>
        <FieldGroup>
          {/* Email */}
          <Field orientation='responsive'>
            <FieldContent>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <FieldDescription>
                Provide a valid email address to associate with your account
              </FieldDescription>
            </FieldContent>
            <Input
              {...form.register('email')}
              id='email'
              name='email'
              placeholder='Email address'
              type='email'
            />
          </Field>
          <>
            <Field>
              <Input
                {...form.register('captchaToken')}
                id='captcha-token'
                name='captchaToken'
                type='hidden'
                value={captchaToken}
              />
            </Field>
            <Field>
              <Input
                {...form.register('emailRedirectTo')}
                id='email-redirect-to'
                name='emailRedirectTo'
                type='hidden'
                value={emailRedirect.toString()}
              />
            </Field>
            <Field>
              <Input
                {...form.register('redirectTo')}
                id='redirect-to'
                name='redirectTo'
                type='hidden'
                value={redirectUrl.toString()}
              />
            </Field>
          </>
          <Field orientation='responsive'>
            <Button
              form='passwordless-form'
              id='passwordless-form-submit'
              data-testid='passwordless-form-submit'
              type='submit'
              variant='outline'
              className='w-full'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2Icon className='animate-spin size-5' />
                  <span className='animate-pulse'>Signing in...</span>
                </>
              ) : (
                <>
                  <LogInIcon className='size-5' />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
