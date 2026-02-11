/**
 * Created At: 2025.09.21:08:21:37
 * @author - @FL03
 * @directory - src/features/billing
 * @file - provider.tsx
 */
'use client';
import * as React from 'react';
import { Elements, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
// project
import { useCurrentUser } from '@/features/auth';
import { checkoutItemByPrice } from '@/features/billing';
import { stripeBrowserClient } from '@/lib/stripe';
import { logger } from '@/lib/logger';

interface ProviderProps extends React.PropsWithChildren {
  stripe?: ReturnType<typeof stripeBrowserClient>;
}

export const CustomCheckoutProvider: React.FC<ProviderProps> = ({
  children,
  stripe = stripeBrowserClient(),
}) => {
  const { user, userId, username } = useCurrentUser();
  const customerId = user?.user_metadata?.customer_id;
  return (
    <EmbeddedCheckoutProvider
      stripe={stripe}
      options={{
        fetchClientSecret: async () => {
          return await checkoutItemByPrice({
            customerId,
            userId,
            username,
            priceId: process.env.NEXT_PUBLIC_STRIPE_DEFAULT_PRICE_ID,
          })
            .then((session) => {
              if (session?.client_secret) {
                return session.client_secret;
              }
              throw new Error('Failed to create checkout session');
            })
            .catch((error) => {
              logger.error(
                error,
                'Error fetching client secret: ',
                String(error),
              );
              throw new Error(String(error));
            });
        },
      }}
    >
      {children}
    </EmbeddedCheckoutProvider>
  );
};
export const CustomStripeElementsProvider: React.FC<ProviderProps> = ({
  children,
  stripe = stripeBrowserClient(),
}) => (
  <Elements
    stripe={stripe}
    options={{
      mode: 'subscription',
      amount: 150,
      currency: 'usd',
      appearance: { theme: 'stripe' },
      payment_method_options: {
        card: {},
        us_bank_account: {},
      },
    }}
  >
    {children}
  </Elements>
);
