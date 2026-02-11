/**
 * Created At: 2025.05.16:12:23:35
 * @author - @FL03
 * @file - [username]/layout.tsx
 */
'use server';
// components
import { UserProfileProvider } from '@/features/profiles';

/**
 * The layout for user-specific pages
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<React.PropsWithChildren>} props - the props for the template; note that children
 * are readonly and required.
 */
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <UserProfileProvider username={username}>{children}</UserProfileProvider>
  );
}
Layout.displayName = 'UserLayout';
