'use client';
// imports
import { PropsWithChildren } from 'react';
import { useParams } from 'next/navigation';
// components
import { ProfileProvider } from '@/features/profiles';

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  const { username } = useParams<{ username: string }>();

  return (
    <ProfileProvider username={username} className="h-full w-full flex-1">
      {children}
    </ProfileProvider>
  );
}
Layout.displayName = 'UserProfileLayout';
