/**
 * The base layout for all user-profile pages; i.e. /[username]/*
 * Created At: 2025.05.13:21:38:35
 * @author - @FL03
 * @file - layout.tsx
 */
// imports
import { PropsWithChildren } from 'react';
// project
import { ProfileProvider } from '@/features/profiles';

export default async function Layout({ children, params }: Readonly<PropsWithChildren> & { params: Promise<{ username: string }> }) {
  // const { username } = useParams<{ username: string }>();
  const { username } = await params;

  return (
    <ProfileProvider username={username}>
      {children}
    </ProfileProvider>
  );
}
Layout.displayName = 'UserProfileLayout';
