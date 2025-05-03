/*
  Appellation: auth_gate <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
// project
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
// feature-specific
import {
  EmailPasswordForm,
  PasswordlessLoginForm,
  RegistrationForm,
} from '../widgets';
import { AuthView } from '../types';
// components
import { CloudflareTurnstile } from '@/components/common/turnstile';
import { Separator } from '@/components/ui/separator';

const authGateVariants = cva('', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: 'default',
      centered: '',
    },
  },
});

type AuthGateProps = {
  view?: string | AuthView;
  asChild?: boolean;
  centered?: boolean;
  withCaptcha?: boolean;
} & VariantProps<typeof authGateVariants>;

/**
 * AuthGate component
 * @description - The AuthGate component is a wrapper for the authentication forms. It provides a layout for the forms and handles the logic for displaying the correct form based on the view prop.
 */
export const AuthGate: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & AuthGateProps
> = ({
  ref,
  className,
  view = 'login',
  asChild,
  centered,
  withCaptcha,
  ...props
}) => {
  // get a reference to the isMobile hook
  const isMobile = useIsMobile();
  const router = useRouter();
  // declare a captcha state
  const [captcha, setCaptcha] = React.useState<string | undefined>(undefined);

  // use the useParams hook to get the view

  const isRegister = ['register', 'registration'].includes(view);
  const isPasswordless = ['magic', 'passkey'].includes(view);
  const isEmailPassword = ['login', 'email-password', 'sign-in'].includes(view);

  const title = isRegister ? 'Register' : 'Login';

  const description = isRegister
    ? 'Create an account to get started.'
    : isPasswordless
      ? 'Sign in with a magic link sent to your email.'
      : 'Sign in with your email and password.';

  const isCentered = centered ?? isMobile;

  const renderForm = () => {
    if (isRegister) {
      return (
        <RegistrationForm
          captchaToken={captcha}
          onSubmitSuccess={() => router.push('/admin')}
        />
      );
    }
    if (isPasswordless) {
      return (
        <PasswordlessLoginForm
          captchaToken={captcha}
          onSubmitSuccess={() => router.push('/admin')}
        />
      );
    }
    if (isEmailPassword) {
      return (
        <EmailPasswordForm
          captchaToken={captcha}
          onSubmitSuccess={() => router.push('/admin')}
        />
      );
    }
  };
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col flex-1 max-w-sm w-full h-full',
        isCentered &&
          'items-center justify-center justify-items-center mx-auto container',
        !isCentered && 'ml-auto',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col w-full px-4 py-2 gap-2',
          'bg-card border-card/75 rounded-xl shadow-inner drop-shadow-card drop-shadow-sm',
          !isCentered && 'border-l rounded-none flex-1 h-full',
          isCentered && 'border m-auto'
        )}
      >
        <div className="relative flex flex-col w-full">
          <section className="flex flex-col left-0 mb-2 w-full">
            <div className="font-semibold text-xl tracking-tight">{title}</div>
            <span className="text-muted-foreground text-sm">{description}</span>
          </section>
          {renderForm()}
          <Separator className="my-2" />
          <div className="mx-auto bottom-0">
            <CloudflareTurnstile
              onSuccess={setCaptcha}
              onError={() => setCaptcha(undefined)}
              onExpire={() => setCaptcha(undefined)}
            />
          </div>
        </div>
      </div>
    </Comp>
  );
};
AuthGate.displayName = 'AuthGate';

export default AuthGate;
