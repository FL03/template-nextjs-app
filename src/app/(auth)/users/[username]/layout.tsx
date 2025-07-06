/**
 * Created At: 2025.07.05:19:55:45
 * @author - @FL03
 * @file - user/layout.tsx
 */
'use server';
// imports
import { PropsWithChildren } from 'react';
// components
import { ProfileProvider } from '@/features/users/profiles';

type RouteParams = {
  params: Promise<{ username: string }>;
};

export default async function Layout({
  children,
  params,
}: Readonly<PropsWithChildren> & RouteParams) {
  const { username } = await params;

  return (
    <ProfileProvider username={username} className="flex-1 w-full h-full">
      {children}
    </ProfileProvider>
  );
}
Layout.displayName = 'UserProfileLayout';
