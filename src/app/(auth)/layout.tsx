'use server';
// imports
import { PropsWithChildren } from 'react';
// components
import { PlatformScaffold } from '@/components/platform';
import { ProfileProvider } from '@/features/profiles';

export default async function Layout({
  children,
  searchParams,
}: Readonly<PropsWithChildren> & {
  searchParams: Promise<{ username?: string }>;
}) {
  const { username } = await searchParams;

  return (
    <ProfileProvider username={username} className="min-h-full w-full flex-1">
      <PlatformScaffold>{children}</PlatformScaffold>
    </ProfileProvider>
  );
}
Layout.displayName = 'AuthLayout';
