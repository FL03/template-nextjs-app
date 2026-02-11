/**
 * Created At: 2025.08.10:14:42:23
 * @author - @FL03
 * @file - provider.tsx
 */
'use client';
// imports
import * as React from 'react';
// hooks
import { useUserNotifications } from '@/hooks/use-notifications';

type NotificationContext = {} & ReturnType<typeof useUserNotifications>;

export const NotificationContext =
  React.createContext<NotificationContext | null>(null);

export const useNotifications = (): NotificationContext => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'The useProfile must be used within a `NotificationProvider`',
    );
  }
  return context;
};

export const NotificationProvider: React.FC<
  React.PropsWithChildren<{ username?: string }>
> = ({ children, username }) => {
  // use the hook to get notifications
  const userNotifications = useUserNotifications({ username });
  // memoize the context
  const context = React.useMemo(
    () => ({
      ...userNotifications,
    }),
    [userNotifications],
  );
  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
};
NotificationProvider.displayName = 'NotificationProvider';
